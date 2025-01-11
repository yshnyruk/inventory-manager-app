import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: ResponseType.Token,
    clientId:
      '736721513256-md6k89b1dd0l19mp2dfuelhssbmdtar1.apps.googleusercontent.com',
    iosClientId:
      '736721513256-jae9c9rpof74e0008rs8b16fhkcqcmf7.apps.googleusercontent.com',
    androidClientId:
      '736721513256-qmbrlgnuhdms8veod2bc5tk561b6o0ae.apps.googleusercontent.com',
  });

  const fetchUserInfo = async (token: string) => {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = await res.json();
    setUser(userInfo);
    console.log(userInfo);
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      fetchUserInfo(access_token);
    }
  }, [response]);

  return { user, request, promptAsync };
};
