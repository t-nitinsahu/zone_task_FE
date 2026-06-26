import { Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const NotFoundPage = () => {
  return (
    <Card title="Page not found" subtitle="The page you are looking for does not exist.">
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </Card>
  );
};
