import { RotateCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";
import { Page } from "./Page";
import { PageIntro } from "./PageIntro";
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
      <Page>
        <div className={styles.content} role="alert">
          <PageIntro
            title="Something went wrong"
            description="We couldn't display this story. Your conversation was not sent anywhere, it stays in your browser."
          />

          <Button className={styles.button} onClick={this.props.onBack}>
            <span>BACK TO START</span>
            <RotateCcw width={16} aria-hidden="true" />
          </Button>
        </div>
      </Page>
    );
  }
}
