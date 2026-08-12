import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { YStack, XStack, Input, useTheme, Text, Button, ColorTokens } from 'tamagui';
import { useSignIn, useSSO, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { captureException } from '@/lib/sentry';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily="$body"
      fontSize={13}
      fontWeight="600"
      color="$color11"
      letterSpacing={0.6}
      textTransform="uppercase"
    >
      {children}
    </Text>
  );
}

function OrSeparator({ label }: { label: string }) {
  return (
    <XStack alignItems="center" gap="$3">
      <YStack flex={1} height={1} backgroundColor="$borderColor" />
      <Text fontFamily="$body" fontSize={11} fontWeight="500" color="$color11">{label}</Text>
      <YStack flex={1} height={1} backgroundColor="$borderColor" />
    </XStack>
  );
}

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
  const [mfaMode, setMfaMode] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSubmitting, setMfaSubmitting] = useState(false);

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
      } else if (completeSignIn.status === 'needs_second_factor') {
        const emailFactor = completeSignIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code'
        );
        if (emailFactor && emailFactor.strategy === 'email_code') {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
          setMfaMode(true);
        } else {
          setErrorMsg(t('errors.mfaUnsupported', 'Bu hesap için doğrulama yöntemi desteklenmiyor.'));
        }
      } else if (__DEV__) {
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

  const onVerifyMfaCode = React.useCallback(async () => {
    if (!isLoaded || mfaSubmitting) return;
    setErrorMsg('');
    setMfaSubmitting(true);
    try {
      const result = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code: mfaCode,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(app)/(tabs)');
      } else if (__DEV__) {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setErrorMsg(err.errors?.[0]?.message || t('errors.invalidCode', 'Kod hatalı. Tekrar deneyin.'));
      } else {
        setErrorMsg(t('errors.invalidCode', 'Kod hatalı. Tekrar deneyin.'));
      }
    } finally {
      setMfaSubmitting(false);
    }
  }, [isLoaded, mfaSubmitting, signIn, mfaCode, setActive, router, t]);

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
      captureException(err, { context: 'login.googleSSO' });
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
          <YStack flex={1} padding="$5" paddingTop="$8" backgroundColor="$background">
            <YStack gap="$4">
          <Text fontSize={30} lineHeight={34} fontWeight="800" color="$color" fontFamily="$heading" letterSpacing={-0.5}>{t('loginTitle', 'Giriş Yap')}</Text>

          <Text fontSize="$2" color="$red10" fontFamily="$body" minHeight={18}>{errorMsg}</Text>

          {mfaMode ? (
            <YStack gap="$2">
              <FieldLabel>{t('mfaCodeLabel', 'Doğrulama Kodu')}</FieldLabel>
              <Input
                size="$5"
                autoCapitalize="none"
                keyboardType="number-pad"
                value={mfaCode}
                onChangeText={setMfaCode}
                placeholder={t('mfaCodePlaceholder', 'E-postanıza gelen kod')}
                placeholderTextColor={theme.color11?.val as ColorTokens}
              />
              <Button
                size="$5"
                theme="accent"
                fontWeight="700"
                onPress={onVerifyMfaCode}
                disabled={mfaSubmitting}
              >
                {mfaSubmitting ? t('loading', 'Yükleniyor...') : t('mfaVerifyButton', 'Doğrula')}
              </Button>
            </YStack>
          ) : (
          <>
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <YStack gap="$2">
                <FieldLabel>{t('emailLabel', 'E-posta')}</FieldLabel>
                <Input
                  size="$5"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder={t('emailPlaceholder', 'E-posta')}
                  placeholderTextColor={theme.color11?.val as ColorTokens}
                />
                {error && <Text fontSize="$2" color="$red10" fontFamily="$body">{error.message}</Text>}
              </YStack>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <YStack gap="$2">
                <FieldLabel>{t('passwordLabel', 'Şifre')}</FieldLabel>
                <Input
                  size="$5"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                  textContentType="password"
                  placeholder={t('passwordPlaceholder', 'Şifre')}
                  placeholderTextColor={theme.color11?.val as ColorTokens}
                />
                {error && <Text fontSize="$2" color="$red10" fontFamily="$body">{error.message}</Text>}
              </YStack>
            )}
          />

          <Button
            size="$5"
            theme="accent"
            fontWeight="700"
            onPress={onSignInPress}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t('loading', 'Yükleniyor...') : t('loginButton', 'Giriş Yap')}
          </Button>
          </>
          )}

          {!mfaMode && (
          <>
          <OrSeparator label={t('or', 'VEYA')} />

          <Button
            size="$5"
            backgroundColor="transparent"
            color="$color"
            borderWidth={1}
            borderColor="$borderColor"
            icon={<GoogleIcon size={18} />}
            onPress={onPressGoogle}
            disabled={ssoLoading}
          >
            {ssoLoading ? t('loading', 'Yükleniyor...') : t('loginGoogle', 'Google ile Giriş Yap')}
          </Button>
          </>
          )}
            </YStack>

            <YStack marginTop="auto" gap="$3">
              <XStack justifyContent="center">
                <Text fontSize="$4" color="$color" fontFamily="$body">{t('noAccount', 'Hesabın yok mu?')} </Text>
                <Link href="/(auth)/register">
                  <Text fontSize="$4" color="$accent9" fontFamily="$body">{t('registerLink', 'Kayıt Ol')}</Text>
                </Link>
              </XStack>

              <Button
                size="$5"
                backgroundColor="transparent"
                color="$color11"
                borderWidth={1}
                borderColor="$borderColor"
                onPress={() => router.replace('/(app)/(tabs)')}
              >
                {t('continueAsGuest', 'Misafir Olarak Devam Et')}
              </Button>
            </YStack>
      </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
