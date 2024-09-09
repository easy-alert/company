import { uploadManyFiles } from '../../utils/functions';
import * as Style from './styles';
import { ListTag } from '../ListTag';
import { DragAndDropFiles } from '../DragAndDropFiles';

interface IMaintenanceInstructionsComponent {
  setFieldValue: any;
  setOnFileQuery: React.Dispatch<React.SetStateAction<boolean>>;
  onFileQuery: boolean;
  instructions: { url: string; name: string }[];
}

export const MaintenanceInstructionsComponent = ({
  setFieldValue,
  setOnFileQuery,
  onFileQuery,
  instructions,
}: IMaintenanceInstructionsComponent) => (
  <Style.Container>
    <DragAndDropFiles
      width="97px"
      height="97px"
      onlyImages={false}
      loading={onFileQuery}
      multiple={false}
      getAcceptedFiles={async ({ acceptedFiles }) => {
        setOnFileQuery(true);

        const uploadedFiles = await uploadManyFiles(acceptedFiles);
        setOnFileQuery(false);

        const formattedUploadedFiles = uploadedFiles.map(({ Location, originalname }) => ({
          name: originalname,
          url: Location,
        }));

        setFieldValue('instructions', formattedUploadedFiles);
      }}
      label="Instruções"
    />

    {instructions.length > 0 && (
      <Style.FileRow>
        {instructions.map(({ url, name }) => (
          <ListTag
            key={url}
            label={name}
            onClick={() => {
              setFieldValue('instructions', []);
            }}
          />
        ))}
      </Style.FileRow>
    )}
  </Style.Container>
);
