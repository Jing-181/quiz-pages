import { state } from '../store/state.js';

/**
 * 设备摇晃检测 composable
 * @param {Function} onShakeDetected - 检测到摇晃时的回调，参数为增量值
 */
export function useDeviceMotion(onShakeDetected) {
  function handleDeviceMotion(e) {
    if (state.shakeProgress >= 100) return;
    var acc = e.accelerationIncludingGravity;
    if (!acc) return;
    var force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > 30) {
      onShakeDetected(2);
    }
  }

  function init() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
  }

  function destroy() {
    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    }
  }

  return { init, destroy };
}
