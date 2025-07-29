type SeverityType = 'error' | 'warning' | 'info' | 'success';

interface BaseAlert {
  message: string;
  severity: SeverityType;
}

interface ComplexAlert {
  message: {
    objType: any;
    message: string;
    messageLevel: number;
  };
  severity: SeverityType;
}

export type AlertType = BaseAlert | ComplexAlert;
