import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { UIPartialRule } from '../../../../../interfaces/PartialRules';
import { sortByName } from '../../../../../utils/nameIdSort';

interface RenderPartialRulesProps extends GridRenderCellParams {
  partialRuleCell: string;
}

const RenderPartialRules = (props: RenderPartialRulesProps) => {
  const { partialRuleCell, row } = props;

  if (!row.partialRules) return null;

  const sortedPartialRules = sortByName(row.partialRules) as UIPartialRule[];
  return (
    <div>
      {sortedPartialRules.map((rule, index) => {
        return (
          <div key={index}>
            <Typography>
              {rule[partialRuleCell] ? rule[partialRuleCell] : <br />}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default RenderPartialRules;
