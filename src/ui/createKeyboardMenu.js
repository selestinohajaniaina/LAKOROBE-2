import Phaser from "phaser";

export default function createKeyboardMenu(
  scene,
  { getButtons, setSelected, activate }
) {
  let current = null;

  const visibleButtons = () =>
    getButtons().filter((b) => b.active && b.visible);

  const select = (button) => {
    if (current === button) return;
    if (current?.active) setSelected(current, false);
    current = button;
    if (button) setSelected(button, true);
  };

  const move = (step, event) => {
    const list = visibleButtons();
    if (!list.length) return;
    event?.preventDefault?.();
    const i = list.indexOf(current);
    const next =
      i === -1
        ? step > 0
          ? 0
          : list.length - 1
        : (i + step + list.length) % list.length;
    select(list[next]);
  };

  const confirm = (event) => {
    if (!current || !current.active || !current.visible) return;
    event?.preventDefault?.();
    const button = current;
    activate(button);
    // le bouton a pu être masqué par l'action (ex. PLAY)
    if (!button.active || !button.visible) {
      if (button.active) setSelected(button, false);
      current = null;
    }
  };

  const keys = [
    ["keydown-UP", (e) => move(-1, e)],
    ["keydown-LEFT", (e) => move(-1, e)],
    ["keydown-DOWN", (e) => move(1, e)],
    ["keydown-RIGHT", (e) => move(1, e)],
    ["keydown-TAB", (e) => move(1, e)],
    ["keydown-ENTER", confirm],
    ["keydown-SPACE", confirm],
  ];
  keys.forEach(([name, fn]) => scene.input.keyboard.on(name, fn));

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    keys.forEach(([name, fn]) => scene.input.keyboard?.off(name, fn));
    current = null;
  });

  return { select, clear: () => select(null) };
}