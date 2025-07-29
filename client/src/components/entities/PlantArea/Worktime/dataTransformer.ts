import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import {
  BackendWorkingHour,
  UIWorkingHour,
} from '../../../../interfaces/WorkingHours';
import { format, parse, isValid } from 'date-fns';

export const transformWorkingHours: Transformer<
  BackendWorkingHour,
  UIWorkingHour
> = (data: { [key: string]: any }): UIWorkingHour[] => {
  const parseTime = (timeString: string) => {
    const timeFormats = ['HH:mm:ss', 'HH:mm'];
    for (const formatString of timeFormats) {
      const parsedDate = parse(timeString, formatString, new Date());
      if (isValid(parsedDate)) return parsedDate;
    }
    return null;
  };

  const transformedData = data.azintervalle.map(
    (workingHour: BackendWorkingHour): UIWorkingHour => {
      return {
        id: workingHour.id,
        name: workingHour.name,
        startTime: workingHour.startUhrzeit
          ? parseTime(workingHour.startUhrzeit)
          : null,
        endTime: workingHour.endeUhrzeit
          ? parseTime(workingHour.endeUhrzeit)
          : null,
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformWorkingHours: Untransformer<
  UIWorkingHour,
  BackendWorkingHour
> = (uiData: UIWorkingHour): BackendWorkingHour => {
  let backendWorkingHour: BackendWorkingHour;

  backendWorkingHour = {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    startUhrzeit: uiData.startTime ? format(uiData.startTime, 'HH:mm:ss') : '',
    endeUhrzeit: uiData.endTime ? format(uiData.endTime, 'HH:mm:ss') : '',
  };
  return backendWorkingHour;
};
