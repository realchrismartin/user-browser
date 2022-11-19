import { Alert } from 'react-bootstrap';
import { useAppContext } from './context/AppContext';

export default function ErrorMessage() {
  const context = useAppContext();

  if (context.error) {
    return (
      <Alert className="sub-alert" variant="danger" dismissible onClose={() => context.clearError!()}>
        <p className="mb-3">{context.error.message}</p>
        { context.error.debug ?
          <pre className="alert-pre border bg-light p-2"><code>{context.error.debug}</code></pre>
          : null
        }
      </Alert>
    );
  }

  return null;
}