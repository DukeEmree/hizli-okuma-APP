import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { YStack, XStack, Input, useTheme, Text, Button, ColorTokens } from 'tamagui';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

export default function RegisterScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { t } = useTranslation('auth');
  const router = useRouter();
  const theme = useTheme();

  const registerSchema = z.object({
    email: z.string().min(1, { message: t('validation.requiredEmail', 'E-posta boş bırakılamaz.') }).email({ message: t('validation.invalidEmail', 'Geçerli bir e-posta adresi girin.') }),
    password: z.string()
      .min(9, { message: t('validation.shortPassword', 'Şifre en az 9 karakter olmalıdır.') })
      .regex(/[A-Z]/, { message: t('validation.uppercasePassword', 'Şifre en az bir büyük harf içermelidir.') })
      .regex(/[a-z]/, { message: t('validation.lowercasePassword', 'Şifre en az bir küçük harf içermelidir.') }),
    passwordConfirmation: z.string().min(1, { message: t('validation.requiredPasswordConfirmation', 'Şifre tekrarı boş bırakılamaz.') }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: t('validation.passwordMismatch', 'Şifreler eşleşmiyor.'),
    path: ["passwordConfirmation"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const codeSchema = z.object({
    code: z.string().min(1, { message: t('validation.requiredCode', 'Doğrulama kodu boş bırakılamaz.') }),
  });

  type CodeFormValues = z.infer<typeof codeSchema>;

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: '',
    },
  });

  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSignUpPress = registerForm.handleSubmit(async (data) => {
    if (!isLoaded) return;
    setErrorMsg('');
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setErrorMsg(err.errors?.[0]?.message || t('errors.registerFailed', 'Kayıt olurken bir hata oluştu.'));
      } else {
        setErrorMsg(t('errors.registerFailed', 'Kayıt olurken bir hata oluştu.'));
      }
    }
  });

  const onPressVerify = codeForm.handleSubmit(async (data) => {
    if (!isLoaded) return;
    setErrorMsg('');
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(app)/(tabs)');
      } else if (__DEV__) {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setErrorMsg(err.errors?.[0]?.message || t('errors.invalidCode', 'Doğrulama kodu hatalı.'));
      } else {
        setErrorMsg(t('errors.invalidCode', 'Doğrulama kodu hatalı.'));
      }
    }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <YStack flex={1} padding="$5" paddingTop="$8" backgroundColor="$background">
            <YStack gap="$4">
          <Text fontSize={30} lineHeight={34} fontWeight="800" color="$color" fontFamily="$heading" letterSpacing={-0.5}>{t('registerTitle', 'Kayıt Ol')}</Text>

          <Text fontSize="$2" color="$red10" fontFamily="$body" minHeight={18}>{errorMsg}</Text>

          {!pendingVerification && (
            <>
              <Controller
                control={registerForm.control}
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
                control={registerForm.control}
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
                      textContentType="newPassword"
                      placeholder={t('passwordPlaceholder', 'Şifre')}
                      placeholderTextColor={theme.color11?.val as ColorTokens}
                    />
                    {error && <Text fontSize="$2" color="$red10" fontFamily="$body">{error.message}</Text>}
                  </YStack>
                )}
              />

              <Controller
                control={registerForm.control}
                name="passwordConfirmation"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <YStack gap="$2">
                    <FieldLabel>{t('passwordConfirmationLabel', 'Şifre Tekrar')}</FieldLabel>
                    <Input
                      size="$5"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry
                      textContentType="newPassword"
                      placeholder={t('passwordConfirmationPlaceholder', 'Şifre Tekrar')}
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
                onPress={onSignUpPress}
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? t('loading', 'Yükleniyor...') : t('registerButton', 'Kayıt Ol')}
              </Button>
            </>
          )}

          {pendingVerification && (
            <>
              <Text fontSize="$4" color="$color" fontFamily="$body" textAlign="center">
                {t('verifyInstruction', 'E-postanıza gönderilen doğrulama kodunu girin.')}
              </Text>

              <Controller
                control={codeForm.control}
                name="code"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <YStack gap="$2">
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      placeholder={t('codePlaceholder', 'Doğrulama Kodu')}
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
                onPress={onPressVerify}
                disabled={codeForm.formState.isSubmitting}
              >
                {codeForm.formState.isSubmitting ? t('loading', 'Yükleniyor...') : t('verifyButton', 'Doğrula')}
              </Button>
            </>
          )}
            </YStack>

            {!pendingVerification && (
              <YStack marginTop="auto" gap="$3">
                <XStack justifyContent="center">
                  <Text fontSize="$4" color="$color" fontFamily="$body">{t('haveAccount', 'Zaten hesabın var mı?')} </Text>
                  <Link href="/(auth)/login">
                    <Text fontSize="$4" color="$accent9" fontFamily="$body">{t('loginLink', 'Giriş Yap')}</Text>
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
            )}
      </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
