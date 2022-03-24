import { withDelay } from '../../animation';
import {
  EntryExitAnimationFunction,
  AnimationFunction,
  LayoutAnimationFunction,
  BaseBuilderAnimationConfig,
} from './commonTypes';

export class BaseAnimationBuilder {
  isApiV2V = false;
  durationV?: number;
  delayV?: number;
  randomizeDelay = false;
  callbackV?: (finished: boolean) => void;
  remoteConfigObject?: BaseBuilderAnimationConfig;

  static createInstance: () => BaseAnimationBuilder;
  build = (): EntryExitAnimationFunction | LayoutAnimationFunction => {
    throw Error('Unimplemented method in child class.');
  };

  static duration(durationMs: number): BaseAnimationBuilder {
    const instance = this.createInstance();
    return instance.duration(durationMs);
  }

  duration(durationMs: number): BaseAnimationBuilder {
    this.durationV = durationMs;
    return this;
  }

  static delay(delayMs: number): BaseAnimationBuilder {
    const instance = this.createInstance();
    return instance.delay(delayMs);
  }

  delay(delayMs: number): BaseAnimationBuilder {
    this.delayV = delayMs;
    return this;
  }

  static withCallback(
    callback: (finished: boolean) => void
  ): BaseAnimationBuilder {
    const instance = this.createInstance();
    return instance.withCallback(callback);
  }

  withCallback(callback: (finsihed: boolean) => void): BaseAnimationBuilder {
    this.callbackV = callback;
    return this;
  }

  // 300ms is the default animation duration. If any animation has different default has to override this method.
  static getDuration(): number {
    return 300;
  }

  getDuration(): number {
    return this.durationV ?? 300;
  }

  static randomDelay(): BaseAnimationBuilder {
    const instance = this.createInstance();
    return instance.randomDelay();
  }

  randomDelay(): BaseAnimationBuilder {
    this.randomizeDelay = true;
    return this;
  }

  // when randomizeDelay is set to true, randomize delay between 0 and provided value (or 1000ms if delay is not provided)
  getDelay(): number {
    return this.randomizeDelay
      ? Math.random() * (this.delayV ?? 1000)
      : this.delayV ?? 0;
  }

  getDelayFunction(): AnimationFunction {
    const isDelayProvided = this.randomizeDelay || this.delayV;
    return isDelayProvided
      ? withDelay
      : (_, animation) => {
          'worklet';
          return animation;
        };
  }

  static isApiV2(): boolean {
    const instance = this.createInstance();
    return instance.isApiV2();
  }

  isApiV2(): boolean {
    return this.isApiV2V;
  }

  _setRemoteConfig(remoteConfigObject: BaseBuilderAnimationConfig) {
    // used by predefined layout animation api v2
    this.remoteConfigObject = remoteConfigObject;
  }

  getAnimationConfig(): BaseBuilderAnimationConfig {
    throw Error('Unimplemented method in child class.');
  }

  static getAnimationConfig(): BaseBuilderAnimationConfig {
    const instance = this.createInstance();
    return instance.getAnimationConfig();
  }

  static build(): EntryExitAnimationFunction | LayoutAnimationFunction {
    const instance = this.createInstance();
    return instance.build();
  }
}
