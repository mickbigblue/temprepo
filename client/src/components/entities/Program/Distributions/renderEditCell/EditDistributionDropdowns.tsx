import { SelectChangeEvent } from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import React, { useEffect, useState } from 'react';
import { NameIdRecord } from '../../../../../interfaces/NameIdRecord';
import EditNameIdDropdownCell from '../../../../common/renderEditCell/EditNameIdDropdownCell';

interface DropdownProps extends GridRenderEditCellParams {
  label: string;
}

export const EditSectionDropdownCell: React.FC<DropdownProps> = (params) => {
  const { id, api, field, additionalData, value } = params;
  const [section, setSection] = useState(value?.name || '');
  const [filteredSections, setFilteredSections] = useState<NameIdRecord[]>([]);

  useEffect(() => {
    const sectionIds = new Set(
      additionalData.possibleCombinations.map(
        (combination: any) => combination.sectionId
      )
    );

    setFilteredSections(
      additionalData.sections.filter((section: NameIdRecord) =>
        sectionIds.has(section.id)
      )
    );
  }, [additionalData]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const selectedSection = filteredSections.find(
      (section: NameIdRecord) => section.name === selectedValue
    );
    setSection(selectedValue);
    api.setEditCellValue(
      {
        id,
        field: 'section',
        value: { id: selectedSection?.id, name: selectedValue },
      },
      event
    );
    api.setEditCellValue({ id, field: 'vehicleClass', value: null }, event);
    api.setEditCellValue({ id, field: 'predecessor', value: null }, event);
    api.updateRows([
      {
        id,
        section: { id: selectedSection?.id, name: selectedValue },
        vehicleClass: null,
        predecessor: null,
      },
    ]);
  };

  return (
    <EditNameIdDropdownCell
      {...params}
      customHandleChange={handleChange}
      options={filteredSections}
    />
  );
};

export const EditVehicleClassDropdownCell: React.FC<DropdownProps> = (
  params
) => {
  const { additionalData, api, value, id, field } = params;
  const { vehicleClasses, possibleCombinations } = additionalData;
  const [filteredVehicleClasses, setFilteredVehicleClasses] = useState<
    NameIdRecord[]
  >([]);
  const [vehicleClass, setVehicleClass] = useState(value?.name || '');
  const section = api.getCellValue(id, 'section');

  useEffect(() => {
    if (section) {
      const sectionCombination = possibleCombinations.find(
        (combination: any) => combination.sectionId === section.id
      );
      if (sectionCombination) {
        const vehicleClassIds = sectionCombination.possibleCombinations.map(
          (vc: any) => vc.vehicleClassId
        );
        setFilteredVehicleClasses(
          vehicleClasses.filter((vc: any) => vehicleClassIds.includes(vc.id))
        );
      } else {
        setFilteredVehicleClasses([]);
      }
    } else {
      setFilteredVehicleClasses([]);
    }
  }, [section, id, api, possibleCombinations, vehicleClasses]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const selectedVehicleClass = filteredVehicleClasses.find(
      (vc: any) => vc.name === selectedValue
    );
    setVehicleClass(selectedValue);
    api.setEditCellValue(
      {
        id,
        field,
        value: { id: selectedVehicleClass?.id, name: selectedValue },
      },
      event
    );
    api.setEditCellValue({ id, field: 'predecessor', value: null });
    api.updateRows([
      {
        id,
        vehicleClass: { id: selectedVehicleClass?.id, name: selectedValue },
        predecessor: null,
      },
    ]);
  };

  return (
    <EditNameIdDropdownCell
      {...params}
      options={filteredVehicleClasses}
      customHandleChange={handleChange}
    />
  );
};

export const EditPredecessorDropdownCell: React.FC<DropdownProps> = (
  params
) => {
  const { additionalData, api, id, field, value } = params;
  const { sections, possibleCombinations } = additionalData;
  const [filteredPredecessors, setFilteredPredecessors] = useState<
    NameIdRecord[]
  >([]);
  const [predecessor, setPredecessor] = useState(value?.name || '');
  const section = api.getCellValue(id, 'section');
  const vehicleClass = api.getCellValue(id, 'vehicleClass');

  useEffect(() => {
    if (section && vehicleClass) {
      const selectedVehicleClass = vehicleClass.id;
      const sectionCombination = possibleCombinations.find(
        (combination: any) => combination.sectionId === section.id
      );

      if (sectionCombination) {
        const vehicleClassCombination =
          sectionCombination.possibleCombinations.find(
            (vc: any) => vc.vehicleClassId === selectedVehicleClass
          );

        if (vehicleClassCombination) {
          setFilteredPredecessors(
            sections.filter((section: any) =>
              vehicleClassCombination.possiblePredecessorIds.includes(
                section.id
              )
            )
          );
        } else {
          setFilteredPredecessors([]);
        }
      } else {
        setFilteredPredecessors([]);
      }
    } else {
      setFilteredPredecessors([]);
    }
  }, [section, vehicleClass, id, api, sections, possibleCombinations]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const selectedPredecessor = filteredPredecessors.find(
      (sec: any) => sec.name === selectedValue
    );
    setPredecessor(selectedValue);
    api.setEditCellValue(
      {
        id,
        field,
        value: { id: selectedPredecessor?.id, name: selectedValue },
      },
      event
    );
    api.updateRows([
      { id, predecessor: { id: selectedPredecessor?.id, name: selectedValue } },
    ]);
  };

  return (
    <EditNameIdDropdownCell
      {...params}
      options={filteredPredecessors}
      customHandleChange={handleChange}
    />
  );
};
