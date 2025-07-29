import { format, parse } from 'date-fns';
import {
  BackendDistribution,
  UIDistribution,
} from '../../../../interfaces/Distributions';
import {
  BackendQuantity,
  BackendLineWithCapacity,
  UILineWithCapacity,
  UIQuantity,
} from '../../../../interfaces/Quantities';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformDistributions: Transformer<
  BackendDistribution,
  UIDistribution
> = (data: { [key: string]: any }): UIDistribution[] => {
  const transformedData = data.distributions.map(
    (distribution: BackendDistribution): UIDistribution => {
      return {
        id: distribution.id,
        section: {
          id: distribution.sectionId,
          name: idToName(distribution.sectionId, data.sections)!,
        },
        vehicleClass: {
          id: distribution.vehicleClassId,
          name: idToName(distribution.vehicleClassId, data.vehicleClasses)!,
        },
        predecessor: {
          id: distribution.predecessorId,
          name: idToName(distribution.predecessorId, data.sections)!,
        },
        quantities:
          distribution.quantities && distribution.quantities.length
            ? distribution.quantities.map((quantity: BackendQuantity) => {
                return {
                  id: quantity.date,
                  date: quantity.date
                    ? parse(quantity.date, 'yyyy-MM-dd', new Date())
                    : null,
                  relevantLinesWithCapacity:
                    quantity.relevantLinesWithCapacity?.map(
                      (relevantLine: BackendLineWithCapacity) => {
                        return {
                          id: relevantLine.lineId,
                          name: idToName(relevantLine.lineId, data.lines)!,
                          capacity: relevantLine.capacity,
                        };
                      }
                    ) || [],
                  searchWindow: quantity.searchWindow,
                  quantity: quantity.quantity,
                  isNew: false,
                };
              })
            : [],
        isNew: false,
      };
    }
  );
  return transformedData;
};

export const untransformDistributions: Untransformer<
  UIDistribution,
  BackendDistribution
> = (uiData: UIDistribution): BackendDistribution => {
  let backendDistribution: BackendDistribution;
  backendDistribution = {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    vehicleClassId: uiData.vehicleClass.id!,
    predecessorId: uiData.predecessor.id!,
    sectionId: uiData.section.id!,
    quantities:
      uiData.quantities && uiData.quantities.length
        ? uiData.quantities.map((quantity: UIQuantity) => {
            return {
              date: format(quantity.date!, 'yyyy-MM-dd'),
              relevantLinesWithCapacity: quantity.relevantLinesWithCapacity.map(
                (relevantLine: UILineWithCapacity) => {
                  return {
                    lineId: relevantLine.id,
                    lineName: relevantLine.name,
                    capacity: relevantLine.capacity,
                  };
                }
              ),
              searchWindow: quantity.searchWindow,
              quantity: quantity.quantity,
            };
          })
        : [],
  };
  return backendDistribution;
};
