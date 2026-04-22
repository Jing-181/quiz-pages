import { state } from '../store/state.js';

export function useScene() {
  /**
   * 切换到指定场景
   * @param {string} name - 场景名称 (home / recipe / making / tasting / result)
   */
  function goToScene(name) {
    state.currentScene = name;
    window.scrollTo(0, 0);
  }

  return { goToScene };
}
