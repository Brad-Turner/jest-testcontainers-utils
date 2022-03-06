import { GenericContainer, StartedTestContainer } from 'testcontainers';

export interface WithContainerConfig {
  container: GenericContainer;
  restartOn?: 'all' | 'each';
}

export type WithContainerCallback = (getInstance: () => StartedTestContainer) => void;

/**
 * Creates a describe block that will manage creation and teardown of a supplied testcontainer.
 * @param config
 * @param fn - Contents of a Jest describe block.
 */
export const withContainer = ({ container, restartOn = 'all' }: WithContainerConfig, fn: WithContainerCallback) => {
  return describe(`with ${container.image} container`, function () {
    let instance: StartedTestContainer;

    const lifeCycleBeforeHook = restartOn === 'all' ? beforeAll : beforeEach;
    const lifeCycleAfterHook = restartOn === 'all' ? afterAll : afterEach;

    lifeCycleBeforeHook(async function () {
      instance = await container.start();
    });

    lifeCycleAfterHook(async function () {
      await instance?.stop();
    });

    fn(() => instance);
  });
};
