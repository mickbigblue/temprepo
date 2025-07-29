import { NameIdRecord } from '../../../../interfaces/NameIdRecord';
import { UIPredecessor } from '../../../../interfaces/PredecessorRecord';
import { BackendSection, UISection } from '../../../../interfaces/Sections';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';

export const transformSections: Transformer<
  BackendSection,
  UISection
> = (data: { [key: string]: any }): UISection[] => {
  const transformedData = data.abschnitte.map(
    (section: BackendSection): UISection => {
      return {
        id: section.id,
        guiDisplayNumber: +section.guiDisplayNumber,
        name: section.name,
        type: section.type,
        jph: section.takt,
        inventory: section.umlauf,
        allCPs: {
          planCheckpoint: section.planFepu || null,
          dueCheckpoint: section.dueCheckpoint || null,
          virtualPlanCheckpoint: section.virtualPlanCheckpoint || null,
          virtualDueCheckpoint: section.virtualDueCheckpoint || null,
        },
        virtualVehicleClasses: section.virtualFzegKlassenIds.map(
          (vVehClassId) => {
            return data.fahrzeugklassen.find(
              (vVehClass: NameIdRecord) => vVehClass.id === vVehClassId
            );
          }
        ),
        sched: section.bandId ? true : false,
        line: data.baender.find(
          (line: NameIdRecord) => line.id === section.bandId
        )!,
        predecessors: section.vorgaenger
          ? section.vorgaenger.map((pred) => {
              return {
                id: pred.id,
                section: data.preAbschnitte.find(
                  (section: NameIdRecord) => section.id === pred.abschnittId
                ),
                vehicleClass: data.fahrzeugklassen.find(
                  (vehicleClass: NameIdRecord) =>
                    vehicleClass.id === pred.fahrzeugKlassenId
                ),
                additionalInventory: pred.additionalTaktZuschlag,
              };
            })
          : null,
        ctBackpacks: section.taktrucksaeckeIds.map((ctBackpackId) => {
          return data.taktrucksaecke.find(
            (ctBackpack: NameIdRecord) => ctBackpack.id === ctBackpackId
          )!;
        }),
        density: data.densities.find(
          (density: NameIdRecord) => density.id === section.densityId
        )!,
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformSection: Untransformer<UISection, BackendSection> = (
  uiData: UISection
): BackendSection => {
  const commonFields = {
    guiDisplayNumber: +uiData.guiDisplayNumber,
    name: uiData.name,
    type: uiData.type,
    takt: uiData.jph,
    umlauf: uiData.inventory,
    bandId: uiData.line ? uiData.line.id! : null,
    vorgaenger: uiData.predecessors
      ? uiData.predecessors.map((pred: UIPredecessor) => ({
          abschnittId: pred.section.id!,
          fahrzeugKlassenId: pred.vehicleClass.id!,
          additionalTaktZuschlag: pred.additionalInventory || 0,
        }))
      : null,
    taktrucksaeckeIds: uiData.ctBackpacks
      ? uiData.ctBackpacks.map((ctBp: NameIdRecord) => ctBp.id!)
      : [],
    virtualFzegKlassenIds: uiData.virtualVehicleClasses
      ? uiData.virtualVehicleClasses.map(
          (vVehClass: NameIdRecord) => vVehClass.id!
        )
      : [],
    densityId: uiData.density ? uiData.density.id! : null,
  };

  const checkpointFields =
    uiData.type !== 'VT'
      ? {
          planFepu: uiData.allCPs?.planCheckpoint
            ? uiData.allCPs.planCheckpoint
            : { name: '' },
          dueCheckpoint: uiData.dueCP ? uiData.dueCP.name : null,
          virtualPlanCheckpoint: uiData.vPlanCP ? uiData.vPlanCP.name : null,
          virtualDueCheckpoint: uiData.vDueCP ? uiData.vDueCP.name : null,
        }
      : {};

  return {
    ...commonFields,
    ...checkpointFields,
    ...(uiData.isNew ? {} : { id: uiData.id }),
  };
};
