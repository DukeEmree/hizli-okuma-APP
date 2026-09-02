/**
 * DIRECTION CONTRACT — Paywall (surface round, seed 417329c9, form 6 of 7)
 *
 * THESIS: The screen splits in two and the split is the argument. It refuses
 *   the feature-list-over-plan-cards pitch every subscription screen ships.
 * OWN-WORLD: İz, unchanged. Cool 200° paper above, one solid mineral field
 *   below; ember only where the streak was earned; Inter, numbers large with
 *   units demoted; 9px radii; no second hue anywhere.
 * STORY: "Here is the trace I have already left" (paper, their own data) →
 *   "here is what I cannot reach yet" (the field) → one price, one button.
 * FIRST VIEWPORT: Close top-left. One-line headline. The user's own Track full
 *   width, streak · minutes · best WPM beneath it. Then the fold: a solid
 *   mineral field carrying the offer sentence, two plan cards side by side,
 *   and a full-width CTA. Restore and legal sit quietly under the field.
 * FORM: Split Horizon, index 6 of my ordered list, dealt as the lead.
 *
 * The Scarcity Rule caps coloured pixels at ~10% "on any screen outside a
 * paywall" — this is the one surface the design system exempts, and the lower
 * field is what that exemption is for.
 *
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the
 * finish review, the verdict, DESIGN.md, and every shipping raster carrying
 * its provenance.
 */
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import {
  Button,
  H2,
  H4,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack,
  useTheme,
  useThemeName,
  type ColorTokens,
} from 'tamagui';
import { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';

import { analytics } from '@/lib/analytics';
import { captureException } from '@/lib/sentry';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { buildLocalStats } from '@/utils/localStatistics';
import { buildTrackFromDailyTrends } from '@/components/ui/track/trackLayout';
import { Track } from '@/components/ui/track/Track';
import { exerciseRegistry } from '@/features/exercises/registry';
import { LEGAL_URLS } from '@/constants/legal';
import { contentColumn } from '@/constants/layout';
import { useTodayMs } from '@/hooks/useTodayMs';
import { annualSavingPercent } from './pricing';
import { trialOffer, trialPeriodKey, type TrialOffer } from './trialOffer';
import { usePaywallOffering } from './usePaywallOffering';

const TRACK_DAYS = 14;

/**
 * The colours of the lower field, composed once per theme.
 *
 * A ramp step is a distance from its own theme's ground, not a brightness.
 * `$green9` is the brand solid, and it is L31% against a white page in light
 * but L51% against a near-black page in dark. At badge size that reads as one
 * colour. At half a screen it does not: measured, the field came out 4.0×
 * darker than the page in light and 8.5× brighter in dark — a calm mineral
 * block in one theme and a glare in the other. It also could not carry text:
 * even pure white on `$green9` light is 4.01:1, under the 4.5:1 body minimum,
 * and `$green3` on it was 3.42:1.
 *
 * So the field is picked per theme instead of per step. `$green11` (light) and
 * `$green6` (dark) land at almost the same absolute luminance — 0.119 and
 * 0.096 — so the region weighs the same in both, and every pair below clears
 * 4.5:1 on it. `solid`/`onSolid` are the one bright thing inside: the CTA and
 * the selected plan, which is what the brightness is for.
 */
interface FieldPalette {
  bg: ColorTokens;
  /** Heading. */
  title: ColorTokens;
  /** Body copy. */
  body: ColorTokens;
  /** Fine print and links. */
  quiet: ColorTokens;
  /** Separator. */
  hairline: ColorTokens;
  /** Unselected plan-card border. */
  cardBorder: ColorTokens;
  /** CTA and selected-plan ground, plus its text. */
  solid: ColorTokens;
  onSolid: ColorTokens;
  onSolidQuiet: ColorTokens;
}

const FIELD_LIGHT: FieldPalette = {
  bg: '$green11',
  title: '$green1',
  body: '$green2',
  quiet: '$green3',
  hairline: '$green8',
  cardBorder: '$green7',
  solid: '$green1',
  onSolid: '$green12',
  onSolidQuiet: '$green11',
};

const FIELD_DARK: FieldPalette = {
  bg: '$green6',
  title: '$green12',
  body: '$green11',
  quiet: '$green11',
  hairline: '$green8',
  cardBorder: '$green8',
  solid: '$green12',
  onSolid: '$green2',
  onSolidQuiet: '$green4',
};

function PlanCard({
  pkg,
  saving,
  trial,
  showTrialBadge,
  isSelected,
  onSelect,
  field,
}: {
  pkg: PurchasesPackage;
  saving: number | null;
  trial: TrialOffer | null;
  showTrialBadge: boolean;
  isSelected: boolean;
  onSelect: () => void;
  field: FieldPalette;
}) {
  const { t } = useTranslation('subscription');
  const label = t(`plan.${pkg.packageType}`, { defaultValue: t('plan.other') });
  // A free trial outranks a percentage: "14 gün ücretsiz" is the reason to tap,
  // and two badges on one small card would compete rather than persuade.
  const trialPeriod = trial ? t(trialPeriodKey(trial), { count: trial.value }) : null;
  // ...but only while it tells the two plans apart. When every plan carries the
  // same trial, the badge marks nothing and the CTA below already says it.
  const badge = showTrialBadge && trialPeriod ? t('trial.badge', { period: trialPeriod }) : null;
  const perMonth =
    pkg.packageType !== PACKAGE_TYPE.MONTHLY && pkg.product.pricePerMonth
      ? t('plan.perMonth', { price: formatApproxMonthly(pkg) })
      : null;

  // Selected sits on the field's own light tint rather than a second colour:
  // inside a solid mineral region, "chosen" reads as tonal step, not as hue.
  return (
    <YStack
      flex={1}
      padding="$3"
      borderRadius="$4"
      gap="$1"
      backgroundColor={isSelected ? field.solid : 'transparent'}
      borderWidth={1}
      borderColor={isSelected ? field.solid : field.cardBorder}
      onPress={onSelect}
      pressStyle={{ scale: 0.98 }}
      accessible
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, checked: isSelected }}
      accessibilityLabel={[
        label,
        badge,
        pkg.product.priceString,
        !trialPeriod && saving ? t('plan.saving', { percent: saving }) : null,
      ]
        .filter(Boolean)
        .join(', ')}
    >
      <Text fontSize="$2" fontWeight="bold" color={isSelected ? field.onSolidQuiet : field.quiet}>
        {label}
      </Text>
      <Text fontSize="$7" fontWeight="bold" color={isSelected ? field.onSolid : field.title}>
        {pkg.product.priceString}
      </Text>
      {perMonth ? (
        <Text fontSize="$1" color={isSelected ? field.onSolidQuiet : field.quiet}>
          {perMonth}
        </Text>
      ) : null}
      {badge ? (
        <Text fontSize="$1" fontWeight="bold" color={isSelected ? field.onSolidQuiet : field.body}>
          {badge}
        </Text>
      ) : !trialPeriod && saving !== null ? (
        <Text fontSize="$1" fontWeight="bold" color={isSelected ? field.onSolidQuiet : field.body}>
          {t('plan.saving', { percent: saving })}
        </Text>
      ) : null}
    </YStack>
  );
}

/** Localised monthly-equivalent, derived from the store's own formatted string. */
function formatApproxMonthly(pkg: PurchasesPackage): string {
  const perMonth = pkg.product.pricePerMonth;
  if (!perMonth) return pkg.product.priceString;
  // Reuse the store's formatting by swapping the number inside its own price
  // string, so currency symbol, placement and separators stay whatever the
  // user's store locale produced instead of being re-invented here.
  const rounded = perMonth.toFixed(2).replace(/\.?0+$/, '');
  const numberInPrice = pkg.product.priceString.match(/[\d.,]+/);
  return numberInPrice
    ? pkg.product.priceString.replace(numberInPrice[0], rounded)
    : `${rounded}`;
}

export default function PaywallScreen() {
  const router = useRouter();
  const { t } = useTranslation('subscription');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isPremium } = useRevenueCat();
  const field = useThemeName().startsWith('dark') ? FIELD_DARK : FIELD_LIGHT;

  const { status, packages, selected, select, purchase, restore, isBusy, outcome, retry } =
    usePaywallOffering();

  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const now = useTodayMs(timeZone);

  const stats = useMemo(
    () => buildLocalStats(localSessions, 'all', now, timeZone),
    [localSessions, now, timeZone],
  );
  const trackData = useMemo(
    () => buildTrackFromDailyTrends(stats.dailyTrends, TRACK_DAYS, timeZone, now),
    [stats.dailyTrends, timeZone, now],
  );

  const totalMinutes = Math.round(stats.totalTrainingTimeMs / 60000);
  const bestWpm = stats.exerciseStats.reduce((max, ex) => Math.max(max, ex.bestWpm), 0);
  const hasTrace = stats.totalSessions > 0;

  const monthly = packages.find((p) => p.packageType === PACKAGE_TYPE.MONTHLY);

  // Only the selected plan's trial drives the CTA and the renewal note: the
  // button buys that plan, so promising another plan's trial beside it would
  // describe a purchase the user is not about to make.
  const trialsByPackage = useMemo(
    () => new Map(packages.map((p) => [p.identifier, trialOffer(p)])),
    [packages],
  );
  // A badge on every card distinguishes nothing. It earns its place only when
  // some plans have a trial and others do not.
  const trialCount = [...trialsByPackage.values()].filter(Boolean).length;
  const trialBadgeDiscriminates = trialCount > 0 && trialCount < packages.length;

  const selectedTrial = selected ? trialOffer(selected) : null;
  const selectedTrialPeriod = selectedTrial
    ? t(trialPeriodKey(selectedTrial), { count: selectedTrial.value })
    : null;

  const close = () => router.back();

  const handlePurchase = async () => {
    const bought = await purchase();
    if (bought) {
      analytics.track('subscription_started');
      close();
    }
  };

  const handleRestore = async () => {
    const restored = await restore();
    if (restored) {
      analytics.track('subscription_restored');
      close();
    }
  };

  // Reached by an already-subscribed user (a stale deep link, or an upsell
  // surface that reads `isPremium` before the entitlement settles). Selling
  // again would be the wrong answer to a question they already answered.
  if (isPremium) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center" padding="$4" gap="$3">
        <H4>{t('states.alreadyPremiumTitle')}</H4>
        <Text color="$color11" textAlign="center">{t('states.alreadyPremiumBody')}</Text>
        <Button size="$4.5" theme="accent" marginTop="$4" onPress={close}>
          {t('states.continue')}
        </Button>
      </YStack>
    );
  }

  const closeButton = (
    <Button
      size="$4.5"
      circular
      chromeless
      alignSelf="flex-start"
      icon={<X size={22} color={theme.color11?.val as string} />}
      onPress={close}
      accessibilityLabel={t('close')}
      accessibilityRole="button"
    />
  );

  if (status === 'loading') {
    return (
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top} padding="$4">
        {closeButton}
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          <Spinner size="large" color={theme.green9?.val as string} />
          <Text color="$color11">{t('states.loading')}</Text>
        </YStack>
      </YStack>
    );
  }

  if (status === 'unavailable') {
    return (
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top} padding="$4">
        {closeButton}
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          <H4 textAlign="center">{t('states.unavailableTitle')}</H4>
          <Text color="$color11" textAlign="center">{t('states.unavailableBody')}</Text>
          <Button size="$4.5" theme="accent" marginTop="$4" onPress={retry}>
            {t('states.retry')}
          </Button>
          <Button size="$4.5" variant="outlined" color="$color11" onPress={handleRestore} disabled={isBusy}>
            {t('offer.restore')}
          </Button>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <YStack {...contentColumn} flex={1}>
          {/* ── upper half: paper, and nothing on it but their own evidence ── */}
          <YStack padding="$4" gap="$4">
            {closeButton}

            {hasTrace ? (
              <>
                <H2>{t('trace.label')}</H2>
                <Track
                  data={trackData}
                  size="expanded"
                  accessibilityLabel={t('trace.a11y', {
                    days: currentStreak,
                    minutes: totalMinutes,
                    wpm: bestWpm,
                  })}
                />
                <XStack gap="$3">
                  <Figure value={currentStreak} unit={t('trace.streak')} tone="ember" />
                  <Figure value={totalMinutes} unit={t('trace.minutes')} />
                  {bestWpm > 0 ? <Figure value={bestWpm} unit={t('trace.bestWpm')} /> : null}
                </XStack>
              </>
            ) : (
              <>
                <H2>{t('empty.label')}</H2>
                <Text color="$color11">{t('empty.planNote')}</Text>
                <ExerciseRoster />
              </>
            )}
          </YStack>

          {/* ── the fold: colour owns this region, and only this one ── */}
          <YStack
            flex={1}
            backgroundColor={field.bg}
            padding="$4"
            gap="$4"
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
          >
            <YStack gap="$2">
              <H4 color={field.title}>{t('offer.title')}</H4>
              <Text color={field.body} fontSize="$3" lineHeight={22}>
                {t('offer.body')}
              </Text>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* The decision stays on screen: the prices and the button. Inside the
          scroll, both fell below the fold at font_scale 1.3 - a paywall showing
          neither a price nor its own button is not a paywall. Same ground as
          the field above, so the two read as one region and only the argument
          scrolls. */}
      <YStack
        {...contentColumn}
        backgroundColor={field.bg}
        paddingHorizontal="$4"
        paddingTop="$3"
        paddingBottom={insets.bottom + 16}
        gap="$3"
      >
        <XStack gap="$3">
          {packages.map((pkg) => (
            <PlanCard
              key={pkg.identifier}
              pkg={pkg}
              saving={annualSavingPercent(pkg, monthly)}
              trial={trialsByPackage.get(pkg.identifier) ?? null}
              showTrialBadge={trialBadgeDiscriminates}
              isSelected={selected?.identifier === pkg.identifier}
              onSelect={() => select(pkg)}
              field={field}
            />
          ))}
        </XStack>

        {outcome.kind === 'failed' || outcome.kind === 'nothingToRestore' ? (
          <Text color={field.title} fontSize="$2" fontWeight="bold">
            {t(outcome.kind === 'failed' ? 'states.failed' : 'states.nothingToRestore')}
          </Text>
        ) : null}

        <Button
          size="$5"
          backgroundColor={field.solid}
          color={field.onSolid}
          borderRadius="$4"
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
          onPress={handlePurchase}
          disabled={isBusy || !selected}
          opacity={isBusy ? 0.7 : 1}
          accessibilityRole="button"
          accessibilityState={{ disabled: isBusy, busy: isBusy }}
        >
          {isBusy ? (
            <Spinner color={field.onSolid} />
          ) : selectedTrialPeriod ? (
            t('trial.cta', { period: selectedTrialPeriod })
          ) : (
            t('offer.cta')
          )}
        </Button>

        {/* Play requires the terms of a trial-to-paid conversion to be
            visible before purchase, not only in the store sheet. */}
        <Text color={field.quiet} fontSize="$1" textAlign="center" lineHeight={16}>
          {selectedTrialPeriod && selected
            ? t('trial.renewNote', {
                period: selectedTrialPeriod,
                price: selected.product.priceString,
              })
            : t('offer.renewNote')}
        </Text>

        <Separator borderColor={field.hairline} />

        <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$2">
          <Text
            fontSize="$2"
            color={field.body}
            fontWeight="bold"
            onPress={handleRestore}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            pressStyle={{ opacity: 0.7 }}
            accessibilityRole="button"
            accessibilityLabel={t('offer.restore')}
          >
            {t('offer.restore')}
          </Text>
          <XStack gap="$3">
            <LegalLink label={t('offer.terms')} url={LEGAL_URLS.termsOfService} color={field.quiet} />
            <LegalLink label={t('offer.privacy')} url={LEGAL_URLS.privacyPolicy} color={field.quiet} />
          </XStack>
        </XStack>

      </YStack>
    </YStack>
  );
}

/** A number with its unit demoted, per the design's Unit Demotion Rule. */
function Figure({ value, unit, tone }: { value: number; unit: string; tone?: 'ember' }) {
  return (
    <YStack flex={1} gap="$1">
      <Text fontSize="$7" fontWeight="bold" color={tone === 'ember' ? '$orange11' : '$color'}>
        {value}
      </Text>
      <Text fontSize="$1" color="$color11">
        {unit}
      </Text>
    </YStack>
  );
}

/**
 * The empty-state substitute for the Track: the fifteen exercises by name, the
 * four in today's plan at full strength and the rest dimmed. A user with no
 * history has no trace to show, so the upper half shows what is waiting instead.
 */
function ExerciseRoster() {
  const { t: tExercises } = useTranslation('exercises');
  const all = exerciseRegistry.getAll();
  return (
    <XStack flexWrap="wrap" gap="$2">
      {all.map((exercise, index) => (
        <Text
          key={exercise.id}
          fontSize="$2"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$3"
          backgroundColor={index < 4 ? '$green3' : '$backgroundHover'}
          color={index < 4 ? '$green11' : '$color11'}
        >
          {tExercises(exercise.nameKey, exercise.type)}
        </Text>
      ))}
    </XStack>
  );
}

function LegalLink({ label, url, color }: { label: string; url: string; color: ColorTokens }) {
  // Same in-app browser Settings uses: Play requires these reachable from the
  // purchase screen, and losing the user to an external app mid-purchase is
  // the one navigation this screen cannot afford.
  const open = async () => {
    try {
      await openBrowserAsync(url, { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC });
    } catch (error) {
      captureException(error, { context: 'PaywallScreen.LegalLink', url });
    }
  };

  return (
    <Text
      fontSize="$2"
      color={color}
      textDecorationLine="underline"
      onPress={open}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      pressStyle={{ opacity: 0.7 }}
      accessibilityRole="link"
      accessibilityLabel={label}
    >
      {label}
    </Text>
  );
}

