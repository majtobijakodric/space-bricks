import blueAbilityIconSrc from '../assets/rocks/blue/rock_2.png';
import redAbilityIconSrc from '../assets/rocks/red/rock_2.png';

import {
  addFuel,
  applyFuelPause,
  applyFuelDrainMultiplier,
  applyPadSpeedMultiplier,
  applyPadWidthMultiplier,
  applyRocketSpeedMultiplier,
  clearGameplayEffects,
} from './game.ts';

export type AbilityColor = 'red' | 'blue';

type AbilitySlotState = {
  charges: number;
  pulsing: boolean;
};

type AbilityUiState = {
  message: string;
  slots: Record<AbilityColor, AbilitySlotState>;
};

type AbilityEffect = {
  message: string;
  apply: () => void;
};

const PULSE_DURATION_MS = 900;
const MESSAGE_DURATION_MS = 3200;

const abilityIconSources: Record<AbilityColor, string> = {
  red: redAbilityIconSrc,
  blue: blueAbilityIconSrc,
};

const abilityState: AbilityUiState = {
  message: '',
  slots: {
    red: { charges: 0, pulsing: false },
    blue: { charges: 0, pulsing: false },
  },
};

const listeners = new Set<() => void>();

let messageTimeoutId: ReturnType<typeof setTimeout> | null = null;

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function pickRandomEffect(effects: readonly AbilityEffect[]) {
  return effects[Math.floor(Math.random() * effects.length)] ?? effects[0];
}

function showAbilityMessage(message: string) {
  abilityState.message = message;

  if (messageTimeoutId !== null) {
    clearTimeout(messageTimeoutId);
  }

  messageTimeoutId = setTimeout(() => {
    abilityState.message = '';
    messageTimeoutId = null;
    notifyListeners();
  }, MESSAGE_DURATION_MS);

  notifyListeners();
}

const redEffects: readonly AbilityEffect[] = [
  {
    message: 'Fuel paused for 5 seconds.',
    apply: () => {
      applyFuelPause(5000);
    },
  },
  {
    message: 'Fuel reserves restored by 1.',
    apply: () => {
      addFuel(1);
    },
  },
  {
    message: 'Pad expanded for 8 seconds.',
    apply: () => {
      applyPadWidthMultiplier(1.45, 8000);
    },
  },
  {
    message: 'Fuel drain slowed for 8 seconds.',
    apply: () => {
      applyFuelDrainMultiplier(0.45, 8000);
    },
  },
];

const blueEffects: readonly AbilityEffect[] = [
  {
    message: 'Pad thrusters boosted for 8 seconds.',
    apply: () => {
      applyPadSpeedMultiplier(1.75, 8000);
    },
  },
  {
    message: 'Rocket stabilized for 8 seconds.',
    apply: () => {
      applyRocketSpeedMultiplier(0.72, 8000);
    },
  },
  {
    message: 'Pad controls slowed for 8 seconds.',
    apply: () => {
      applyPadSpeedMultiplier(0.55, 8000);
    },
  },
  {
    message: 'Rocket overdrive engaged for 8 seconds.',
    apply: () => {
      applyRocketSpeedMultiplier(1.45, 8000);
    },
  },
  {
    message: 'Fuel drain spiked for 5 seconds.',
    apply: () => {
      applyFuelDrainMultiplier(2.2, 5000);
    },
  },
];

export function getAbilityIconSource(color: AbilityColor) {
  return abilityIconSources[color];
}

export function getAbilityState() {
  return {
    message: abilityState.message,
    slots: {
      red: { ...abilityState.slots.red },
      blue: { ...abilityState.slots.blue },
    },
  };
}

export function subscribeToAbilityState(listener: () => void) {
  listeners.add(listener);
  listener();

  return () => {
    listeners.delete(listener);
  };
}

export function chargeAbility(color: AbilityColor) {
  const slot = abilityState.slots[color];

  slot.charges += 1;
  slot.pulsing = true;
  notifyListeners();

  setTimeout(() => {
    slot.pulsing = false;
    notifyListeners();
  }, PULSE_DURATION_MS);

  return true;
}

export function activateAbility(color: AbilityColor) {
  const slot = abilityState.slots[color];

  if (slot.charges === 0) {
    return false;
  }

  slot.charges -= 1;
  slot.pulsing = false;

  const effect = pickRandomEffect(color === 'red' ? redEffects : blueEffects);
  effect.apply();
  showAbilityMessage(effect.message);
  return true;
}

export function resetAbilitySystem() {
  abilityState.message = '';
  abilityState.slots.red.charges = 0;
  abilityState.slots.red.pulsing = false;
  abilityState.slots.blue.charges = 0;
  abilityState.slots.blue.pulsing = false;

  if (messageTimeoutId !== null) {
    clearTimeout(messageTimeoutId);
    messageTimeoutId = null;
  }

  clearGameplayEffects();
  notifyListeners();
}
