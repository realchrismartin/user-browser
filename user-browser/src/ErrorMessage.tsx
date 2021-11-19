import { Alert } from 'react-bootstrap';
import { useAppContext } from './auth/AppContext';

export default function ErrorMessage() {
  const app = useAppContext();

  if (app.error) {
    return (
      <Alert className="sub-alert" variant="danger" dismissible onClose={() => app.clearError!()}>
        <p className="mb-3">{app.error.message}</p>
        { app.error.debug ?
          <pre className="alert-pre border bg-light p-2"><code>{app.error.debug}</code></pre>
          : null
        }
      </Alert>
    );
  }

  return null;
}