import { state } from '../store/state.js';

export function useScene() {
  function goToScene(sceneName) {
    state.currentScene = sceneName;
  }

  function goHome() {
    state.currentScene = 'home';
  }

  function goToRecipe() {
    state.currentScene = 'recipe';
  }

  function goToMaking() {
    state.currentScene = 'making';
  }

  function goToTasting() {
    state.currentScene = 'tasting';
  }

  function goToResult() {
    state.currentScene = 'result';
  }

  return {
    goToScene,
    goHome,
    goToRecipe,
    goToMaking,
    goToTasting,
    goToResult,
  };
}