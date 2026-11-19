import Phaser from "phaser";

// Phaser creates an input hit area only once. Responsive container buttons are
// resized after creation, so their input rectangle must be resized as well.
export function configureButtonInput(button, width, height) {
  button.setSize(width, height);

  if (button.input?.hitArea instanceof Phaser.Geom.Rectangle) {
    button.input.hitArea.setTo(0, 0, width, height);
    button.input.hitAreaCallback = Phaser.Geom.Rectangle.Contains;
    button.input.enabled = true;
  } else {
    button.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );
  }

  button.input.cursor = "pointer";
  return button;
}
