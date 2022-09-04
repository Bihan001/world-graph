import { Select } from 'antd';
import { AlgorithmsData, Algorithm } from '../../utilities/interfaces/misc';

const { Option } = Select;

interface AlgorithmSelectProps {
  algorithms: AlgorithmsData;
  changeAlgorithm: (algorithm: Algorithm) => void;
}

const AlgorithmSelect = ({ algorithms, changeAlgorithm }: AlgorithmSelectProps) => {
  const handleChange = (value: string) => {
    changeAlgorithm(algorithms[value]);
  };

  return (
    <Select className='algorithm-select' defaultValue={''} style={{ width: 'fit-content' }} onChange={handleChange}>
      <Option value='' disabled>
        Select an algorithm
      </Option>
      {Object.keys(algorithms).map((key) => (
        <Option key={key} value={key}>
          {algorithms[key].displayName}
        </Option>
      ))}
    </Select>
  );
};

export default AlgorithmSelect;
