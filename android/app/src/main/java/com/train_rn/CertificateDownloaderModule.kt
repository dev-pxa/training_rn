package com.train_rn

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CertificateDownloaderModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "CertificateDownloader"

  @ReactMethod
  fun downloadImage(imageUrl: String, fileName: String?, promise: Promise) {
    if (imageUrl.isBlank()) {
      promise.reject("INVALID_URL", "证书图片地址为空")
      return
    }

    try {
      val uri = Uri.parse(imageUrl)
      val safeFileName = buildSafeFileName(fileName, uri)
      val request = DownloadManager.Request(uri)
        .setTitle(safeFileName)
        .setDescription("正在下载证书")
        .setMimeType(resolveMimeType(safeFileName))
        .setAllowedOverMetered(true)
        .setAllowedOverRoaming(true)
        .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)

      request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, safeFileName)

      val downloadManager = reactContext.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
      val downloadId = downloadManager.enqueue(request)
      waitForDownloadComplete(downloadManager, downloadId, promise)
    } catch (error: Exception) {
      promise.reject("DOWNLOAD_FAILED", error.message ?: "证书下载失败", error)
    }
  }

  private fun waitForDownloadComplete(downloadManager: DownloadManager, downloadId: Long, promise: Promise) {
    var settled = false

    val receiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action != DownloadManager.ACTION_DOWNLOAD_COMPLETE) return

        val completedDownloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L)
        if (completedDownloadId != downloadId || settled) return

        settled = true
        try {
          reactContext.unregisterReceiver(this)
        } catch (_: IllegalArgumentException) {
          // Receiver may already be unregistered if the app lifecycle changed.
        }

        val query = DownloadManager.Query().setFilterById(downloadId)
        val cursor = downloadManager.query(query)

        cursor.use {
          if (it == null || !it.moveToFirst()) {
            promise.reject("DOWNLOAD_FAILED", "证书下载失败")
            return
          }

          val statusIndex = it.getColumnIndex(DownloadManager.COLUMN_STATUS)
          val reasonIndex = it.getColumnIndex(DownloadManager.COLUMN_REASON)
          val status = it.getInt(statusIndex)

          if (status == DownloadManager.STATUS_SUCCESSFUL) {
            promise.resolve(downloadId.toDouble())
            return
          }

          val reason = if (reasonIndex >= 0) it.getInt(reasonIndex) else 0
          promise.reject("DOWNLOAD_FAILED", "证书下载失败，错误码：$reason")
        }
      }
    }

    val filter = IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      reactContext.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
    } else {
      reactContext.registerReceiver(receiver, filter)
    }
  }

  private fun buildSafeFileName(fileName: String?, uri: Uri): String {
    val fallbackExtension = uri.lastPathSegment
      ?.substringAfterLast('.', missingDelimiterValue = "")
      ?.takeIf { it.length in 2..5 }
      ?: "jpg"
    val rawName = fileName?.takeIf { it.isNotBlank() } ?: "certificate_${System.currentTimeMillis()}.$fallbackExtension"
    return rawName.replace(Regex("[\\\\/:*?\"<>|\\s]+"), "_")
  }

  private fun resolveMimeType(fileName: String): String {
    return when (fileName.substringAfterLast('.', "").lowercase()) {
      "png" -> "image/png"
      "webp" -> "image/webp"
      "gif" -> "image/gif"
      else -> "image/jpeg"
    }
  }
}
