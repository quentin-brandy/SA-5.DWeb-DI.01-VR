
export function applyAnimation(robot, rbt) {
  robot.removeAttribute('animation');

  if (rbt.state === "rotation") {
    robot.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear");
  }
  else if (rbt.state === "bump") {
    robot.setAttribute("animation", `property: scale; dir: alternate; dur: 1000; to: ${rbt.scale.sx + 1} ${rbt.scale.sy + 1} ${rbt.scale.sz + 1}; loop: true; easing: easeInOutQuad`);
  }
  else if (rbt.state === "move") {
    robot.setAttribute("animation", `property: position; from: ${rbt.position.x} ${rbt.position.y} ${rbt.position.z};  to: ${rbt.position.x + 5} ${rbt.position.y} ${rbt.position.z}; dur: 3000; dir: alternate; loop: true; easing: easeInOutSine`);
  }
}


