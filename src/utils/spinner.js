import ora from "ora";

export function createSpinner() {
  return ora("");
}

export function startSpinner(spinner, text) {
  spinner.text = text;
  spinner.start();
}

export function stopSpinner(spinner) {
  spinner.stop();
}

export function succeedSpinner(spinner, text, restartText = undefined) {
  spinner.succeed(text);
  spinner.stop();

  if (restartText) {
    startSpinner(spinner, restartText);
  }
}

export function failSpinner(spinner, text, restartText = undefined) {
  spinner.fail(text);

  if (restartText) {
    startSpinner(spinner, restartText);
  }
}
