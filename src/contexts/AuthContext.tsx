import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { LoginResponse } from '../types/login';
import { clearAuthData, loadAuthData, saveAuthData } from '../services/storage';
import { setUnauthorizedHandler } from '../services/request';

interface AuthContextValue {
  /** 启动期是否仍在从本地恢复登录态。为 true 时导航层应该展示启动 loading。 */
  initializing: boolean;
  /** 当前访问令牌。为空表示未登录或登录已失效。 */
  token: string | null;
  /** 当前用户信息。为空表示未登录或登录已失效。 */
  user: LoginResponse['user'] | null;
  /** 同时具备 token 和 user 才算已登录，避免半登录状态进入业务页。 */
  isAuthenticated: boolean;
  /** 登录成功后调用：先持久化，再更新全局状态。 */
  signIn: (data: LoginResponse) => Promise<void>;
  /** 主动退出登录时调用：先清本地，再清内存状态。 */
  signOut: () => Promise<void>;
  /** token 过期时调用：清理登录态，并可提示用户重新登录。 */
  handleAuthExpired: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const authExpiredAlertVisibleRef = useRef(false);

  /**
   * 清理内存态的小工具。
   *
   * 本地存储清理和内存清理分开写，是为了让启动恢复失败、主动退出、401 过期都能复用同一套状态收敛逻辑。
   */
  const resetAuthState = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  /**
   * App 启动时恢复登录态。
   *
   * 恢复动作必须在 AuthProvider 里完成，因为导航层依赖 isAuthenticated 决定渲染登录栈还是业务栈。
   * 如果读取失败，storage 层会清理坏数据，这里只需要进入未登录状态即可。
   */
  useEffect(() => {
    let isMounted = true;

    async function restoreAuthData() {
      const authData = await loadAuthData();

      if (!isMounted) {
        return;
      }

      if (authData) {
        setToken(authData.token);
        setUser(authData.user);
      } else {
        resetAuthState();
      }

      setInitializing(false);
    }

    restoreAuthData();

    return () => {
      isMounted = false;
    };
  }, [resetAuthState]);

  /**
   * 登录成功入口。
   *
   * 这里先 await saveAuthData，再更新 React 状态。
   * saveAuthData 内部会做写后读校验；如果 AsyncStorage 没存下或读回不一致，这里会抛错，
   * LoginScreen 会留在登录页并展示错误，避免“当前进了首页、重启后却丢登录态”的假成功体验。
   */
  const signIn = useCallback(async (data: LoginResponse) => {
    if (!data.token || !data.user) {
      throw new Error('登录接口返回数据缺少 token 或用户信息');
    }

    await saveAuthData(data);
    setToken(data.token);
    setUser(data.user);
  }, []);

  /**
   * 主动退出登录入口。
   *
   * 即使本地清理失败，也继续清掉内存态，让当前会话立即回到登录页。
   * 失败的本地数据会在下次启动恢复时被重新校验。
   */
  const signOut = useCallback(async () => {
    try {
      await clearAuthData();
    } finally {
      resetAuthState();
    }
  }, [resetAuthState]);

  /**
   * token 过期入口。
   *
   * request 层发现 401 后会调用它。这里统一清理登录态，并给用户一个明确提示。
   */
  const handleAuthExpired = useCallback(async () => {
    await signOut();

    /**
     * 多个业务接口可能在同一时刻都收到 401。
     * 用 ref 做一个非常轻量的去重，避免用户连续看到多次“登录已过期”弹窗。
     */
    if (!authExpiredAlertVisibleRef.current) {
      authExpiredAlertVisibleRef.current = true;
      Alert.alert('登录已过期', '请重新登录后继续学习', [
        {
          text: '知道了',
          onPress: () => {
            authExpiredAlertVisibleRef.current = false;
          },
        },
      ]);
    }
  }, [signOut]);

  /**
   * 把 401 处理函数注册给请求层。
   *
   * request.ts 不直接 import AuthContext，避免 service 层和 React 层相互缠住；
   * Provider 挂载时注册，卸载时清空，就能让任何业务请求触发统一过期处理。
   */
  useEffect(() => {
    setUnauthorizedHandler(handleAuthExpired);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [handleAuthExpired]);

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      token,
      user,
      isAuthenticated: Boolean(token && user),
      signIn,
      signOut,
      handleAuthExpired,
    }),
    [handleAuthExpired, initializing, signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }

  return context;
}
