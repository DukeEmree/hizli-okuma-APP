import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { YStack, XStack, Input, useTheme } from 'tamagui';
import { useSignIn, useSSO, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { AppText } from "@/components/ui/AppText";
import { AppButton } from "@/components/ui/AppButton";
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const { t } = useTranslation('auth');
  const router = useRouter();
  const theme = useTheme();

  const loginSchema = z.object({
    email: z.string().min(1, { message: t('validation.requiredEmail', 'E-posta boş bırakılamaz.') }).email({ message: t('validation.invalidEmail', 'Geçerli bir e-posta adresi girin.') }),
    password: z.string().min(1, { message: t('validation.requiredPassword', 'Şifre boş bırakılamaz.') }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [ssoLoading, setSsoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSignInPress = form.handleSubmit(async (data) => {
    if (!isLoaded) return;
    setErrorMsg('');
    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace('/(app)/(tabs)');
      } else {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setErrorMsg(err.errors?.[0]?.message || t('errors.invalidCredentials', 'Giriş başarısız. Bilgilerinizi kontrol edin.'));
      } else {
        setErrorMsg(t('errors.invalidCredentials', 'Giriş başarısız. Bilgilerinizi kontrol edin.'));
      }
    }
  });

  const onPressGoogle = React.useCallback(async () => {
    if (ssoLoading) return;
    setSsoLoading(true);
    setErrorMsg('');
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startSSOFlow({ strategy: 'oauth_google' });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace('/(app)/(tabs)');
      }
    } catch (err: unknown) {
      const isCanceled =
        (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'ERR_REQUEST_CANCELED') ||
        (err instanceof Error && err.message.toLowerCase().includes('cancel'));
        
      if (isCanceled) {
        return;
      }
      console.error('SSO error', err);
      if (isClerkAPIResponseError(err)) {
        setErrorMsg(err.errors?.[0]?.message || t('errors.ssoFailed', 'Google ile giriş yapılırken bir hata oluştu.'));
      } else {
        setErrorMsg(t('errors.ssoFailed', 'Google ile giriş yapılırken bir hata oluştu.'));
      }
    } finally {
      setSsoLoading(false);
    }
  }, [startSSOFlow, router, ssoLoading, t]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <YStack flex={1} padding="$4" justifyContent="center" backgroundColor="$background">
            <YStack gap="$4">
          <AppText variant="title" textAlign="center">{t('loginTitle', 'Giriş Yap')}</AppText>
          
          {!!errorMsg && <AppText variant="caption" color="$red10">{errorMsg}</AppText>}

          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <YStack gap="$2">
                <Input 
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder={t('emailPlaceholder', 'E-posta')}
                  placeholderTextColor="$color11"
                />
                {error && <AppText variant="caption" color="$red10">{error.message}</AppText>}
              </YStack>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <YStack gap="$2">
                <Input 
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                  textContentType="password"
                  placeholder={t('passwordPlaceholder', 'Şifre')}
                  placeholderTextColor="$color11"
                />
                {error && <AppText variant="caption" color="$red10">{error.message}</AppText>}
              </YStack>
            )}
          />

          <AppButton onPress={onSignInPress} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t('loading', 'Yükleniyor...') : t('loginButton', 'Giriş Yap')}
          </AppButton>

          <AppButton btnType="outline" onPress={onPressGoogle} disabled={ssoLoading}>
            {ssoLoading ? t('loading', 'Yükleniyor...') : t('loginGoogle', 'Google ile Giriş Yap')}
          </AppButton>

          <XStack justifyContent="center" marginTop="$4">
            <AppText variant="body">{t('noAccount', 'Hesabın yok mu?')} </AppText>
            <Link href="/(auth)/register">
              <AppText variant="body" color="$blue10">{t('registerLink', 'Kayıt Ol')}</AppText>
            </Link>
          </XStack>
        </YStack>
      </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
