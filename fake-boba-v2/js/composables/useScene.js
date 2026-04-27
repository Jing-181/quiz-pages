import { state } from '../store/state.js';

// 场景管理 composable
const useScene = () => {
  // 导航到指定场景
  const goToScene = (scene) => {
    state.currentScene = scene;
  };

  // 导航到首页
  const goToHome = () => {
    goToScene('home');
  };

  // 导航到配方选择
  const goToRecipe = () => {
    goToScene('recipe');
  };

  // 导航到制作场景
  const goToMaking = () => {
    state.makingProgress = 0;
    goToScene('making');
  };

  // 导航到品尝场景
  const goToTasting = () => {
    state.tastingProgress = 0;
    goToScene('tasting');
  };

  // 导航到结果场景
  const goToResult = () => {
    goToScene('result');
  };

  return {
    goToScene,
    goToHome,
    goToRecipe,
    goToMaking,
    goToTasting,
    goToResult
  };
};

export default useScene;