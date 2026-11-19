export default class CommandManager {
  constructor(maxLines) {
    this.reset(maxLines);
  }

  reset(maxLines) {
    this.maxLines = maxLines;
    this.commands = [];
  }
  add(type) {
    if (this.commands.length >= this.maxLines) return false;
    this.commands.push({ type, repeat: 1 });
    return true;
  }
  undo() {
    return this.commands.pop();
  }
  clear() {
    this.commands = [];
  }
  changeRepeat(index, amount) {
    const command = this.commands[index];
    if (!command) return;
    command.repeat = Math.max(1, Math.min(9, command.repeat + amount));
  }
  actions() {
    return this.commands.flatMap((command, line) =>
      Array.from({ length: command.repeat }, () => ({
        type: command.type,
        line,
      }))
    );
  }
}
