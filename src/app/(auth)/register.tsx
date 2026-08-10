import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { YStack, XStack, Input, useTheme } from 'tamagui';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { AppText } from "@/components/ui/AppText";
import { AppButton } from "@/components/ui/AppButton";
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
      } else {
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
          <YStack flex={1} padding="$4" justifyContent="center" backgroundColor="$background">
            <YStack gap="$4">
          <AppText variant="title" textAlign="center">{t('registerTitle', 'Kayıt Ol')}</AppText>
          
          {!!errorMsg && <AppText variant="caption" color="$red10">{errorMsg}</AppText>}

          {!pendingVerification && (
            <>
              <Controller
                control={registerForm.control}
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
                control={registerForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <YStack gap="$2">
                    <Input 
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry
                      textContentType="newPassword"
                      placeholder={t('passwordPlaceholder', 'Şifre')}
                      placeholderTextColor="$color11"
                    />
                    {error && <AppText variant="caption" color="$red10">{error.message}</AppText>}
                  </YStack>
                )}
              />

              <Controller
                control={registerForm.control}
                name="passwordConfirmation"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <YStack gap="$2">
                    <Input 
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry
                      textContentType="newPassword"
                      placeholder={t('passwordConfirmationPlaceholder', 'Şifre Tekrar')}
                      placeholderTextColor="$color11"
                    />
                    {error && <AppText variant="caption" color="$red10">{error.message}</AppText>}
                  </YStack>
                )}
              />

              <AppButton onPress={onSignUpPress} disabled={registerForm.formState.isSubmitting}>
                {registerForm.formState.isSubmitting ? t('loading', 'Yükleniyor...') : t('registerButton', 'Kayıt Ol')}
              </AppButton>
              
              <XStack justifyContent="center" marginTop="$4">
                <AppText variant="body">{t('haveAccount', 'Zaten hesabın var mı?')} </AppText>
                <Link href="/(auth)/login">
                  <AppText variant="body" color="$blue10">{t('loginLink', 'Giriş Yap')}</AppText>
                </Link>
              </XStack>
            </>
          )}

          {pendingVerification && (
            <>
              <AppText variant="body" textAlign="center">
                {t('verifyInstruction', 'E-postanıza gönderilen doğrulama kodunu girin.')}
              </AppText>
              
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
                      placeholderTextColor="$color11"
                    />
                    {error && <AppText variant="caption" color="$red10">{error.message}</AppText>}
                  </YStack>
                )}
              />

              <AppButton onPress={onPressVerify} disabled={codeForm.formState.isSubmitting}>
                {codeForm.formState.isSubmitting ? t('loading', 'Yükleniyor...') : t('verifyButton', 'Doğrula')}
              </AppButton>
            </>
          )}
        </YStack>
      </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
