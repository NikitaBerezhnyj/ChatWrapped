import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./StoryErrorBoundary.module.css";

interface Props {
  onBack: () => void;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class StoryErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className={styles.page} role="alert">
        <div className={styles.content}>
          <h1 className={styles.title}>Something went wrong</h1>

          <p className={styles.description}>
            We couldn't display this story. Your conversation was not sent anywhere, it stays in
            your browser.
          </p>

          <button className={styles.button} type="button" onClick={this.props.onBack}>
            BACK TO START
          </button>
        </div>
      </main>
    );
  }
}
