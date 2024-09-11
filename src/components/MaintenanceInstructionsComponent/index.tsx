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
      onlyImages={false}
      loading={onFileQuery}
      multiple
      width="97px"
      height="97px"
      getAcceptedFiles={async ({ acceptedFiles }) => {
        setOnFileQuery(true);
        const uploadedFiles = await uploadManyFiles(acceptedFiles);
        setOnFileQuery(false);

        const formattedUploadedFiles = uploadedFiles.map(({ Location, originalname }) => ({
          name: originalname,
          url: Location,
        }));

        setFieldValue('instructions', [...instructions, ...formattedUploadedFiles]);
      }}
      label="Instruções"
    />

    {instructions.length > 0 && (
      <Style.FileRow>
        {instructions.map(({ url, name }, i) => (
          <ListTag
            padding="4px 12px"
            downloadUrl={url}
            key={url}
            label={name}
            onClick={() => {
              const clonedInstructions = structuredClone(instructions);
              clonedInstructions.splice(i, 1);

              setFieldValue('instructions', clonedInstructions);
            }}
          />
        ))}
      </Style.FileRow>
    )}
  </Style.Container>
);
