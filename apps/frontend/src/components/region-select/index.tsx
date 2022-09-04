import { Select } from 'antd';
import { Region, RegionsData } from '../../utilities/interfaces/misc';

const { Option } = Select;

interface LocationSelectProps {
  regions: RegionsData;
  currentRegion?: string;
  changeRegion: (region: Region) => void;
}

const LocationSelect = ({ regions, currentRegion, changeRegion }: LocationSelectProps) => {
  const handleChange = (value: string) => {
    changeRegion(regions[value]);
  };

  const defaultValue = Object.keys(regions).length === 0 ? '' : Object.keys(regions)[0];

  return (
    <Select
      className='region-select'
      value={currentRegion || defaultValue}
      defaultValue={defaultValue}
      style={{ width: 'fit-content' }}
      onChange={(val) => handleChange(val)}
    >
      <Option value='' disabled>
        Select a region
      </Option>
      {Object.keys(regions).map((key) => (
        <Option key={key} value={key}>
          {regions[key].displayName}
        </Option>
      ))}
    </Select>
  );
};

export default LocationSelect;
