// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '@components/Buttons/Button';
import { FormikTextArea } from '@components/Form/FormikTextArea';
import { FormikInput } from '@components/Form/FormikInput';
import { Modal } from '@components/Modal';
import { FormikSelect } from '@components/Form/FormikSelect';

// STYLES
import * as Style from './styles';

// FUNCTIONS
import {
  schemaEditMaintenance,
  requestEditMaintenance,
  requestDeleteMaintenance,
} from './utils/functions';
import { applyMask, capitalizeFirstLetter } from '../../../../../../../../utils/functions';

// TYPES
import { IModalEditMaintenance } from './utils/types';
import { theme } from '../../../../../../../../styles/theme';
import { PopoverButton } from '../../../../../../../../components/Buttons/PopoverButton';
import { Input } from '../../../../../../../../components/Inputs/Input';
import { MaintenanceInstructionsComponent } from '../../../../../../../../components/MaintenanceInstructionsComponent';

export const ModalEditMaintenance = ({
  setModal,
  selectedMaintenance,
  timeIntervals,
  categories,
  setCategories,
  categoryId,
  maintenancePriorities,
}: IModalEditMaintenance) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onFileQuery, setFileOnQuery] = useState<boolean>(false);

  const categoryIndex = categories.findIndex((category) => category.id === categoryId);
  const categoryName = categories[categoryIndex].name;

  return (
    <Modal title="Editar manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          isSelected: !!selectedMaintenance.isSelected,
          element: selectedMaintenance.element,
          activity: selectedMaintenance.activity,
          frequency: String(selectedMaintenance.frequency),
          frequencyTimeInterval: selectedMaintenance.FrequencyTimeInterval.id,
          responsible: selectedMaintenance.responsible,
          source: selectedMaintenance.source,
          period: String(selectedMaintenance.period),
          periodTimeInterval: selectedMaintenance.PeriodTimeInterval.id,
          delay: String(selectedMaintenance.delay),
          delayTimeInterval: selectedMaintenance.DelayTimeInterval.id,
          priorityName: selectedMaintenance.priorityName || 'medium',
          observation:
            selectedMaintenance.observation && selectedMaintenance.observation !== ''
              ? selectedMaintenance.observation
              : '',
          instructions: selectedMaintenance.instructions
            ? selectedMaintenance.instructions.map(({ name, url }) => ({ name, url }))
            : [],
        }}
        validationSchema={schemaEditMaintenance}
        onSubmit={async (values) => {
          requestEditMaintenance({
            timeIntervals,
            maintenanceId: selectedMaintenance.id,
            values,
            setOnQuery,
            setModal,
            categories,
            setCategories,
            categoryId,
          });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              <Input label="Categoria" defaultValue={categoryName} disabled />

              <FormikTextArea
                label="Elemento"
                name="element"
                value={values.element}
                error={touched.element && errors.element ? errors.element : null}
                placeholder="Ex: Rejuntamento e vedações"
                height="60px"
              />

              <FormikTextArea
                label="Atividade"
                name="activity"
                value={values.activity}
                error={touched.activity && errors.activity ? errors.activity : null}
                placeholder="Ex: Verificar sua integridade e reconstruir os rejuntamentos internos e externos dos pisos"
                height="82px"
              />
              <Style.SelectWrapper>
                <FormikInput
                  label="Periodicidade"
                  name="frequency"
                  value={values.frequency}
                  error={touched.frequency && errors.frequency ? errors.frequency : null}
                  placeholder="Ex: 1"
                  maxLength={4}
                  onChange={(e) => {
                    setFieldValue(
                      'frequency',
                      applyMask({ mask: 'NUM', value: e.target.value }).value,
                    );
                  }}
                />
                <FormikSelect
                  selectPlaceholderValue={values.frequencyTimeInterval}
                  name="frequencyTimeInterval"
                  label="Unidade"
                  arrowColor="primary"
                  error={
                    touched.frequencyTimeInterval && errors.frequencyTimeInterval
                      ? errors.frequencyTimeInterval
                      : null
                  }
                >
                  <option value="Selecione" disabled hidden>
                    Selecione
                  </option>
                  {timeIntervals.map((element) => (
                    <option key={element.id} value={element.id}>
                      {Number(values.frequency) > 1
                        ? capitalizeFirstLetter(element.pluralLabel)
                        : capitalizeFirstLetter(element.singularLabel)}
                    </option>
                  ))}
                </FormikSelect>
              </Style.SelectWrapper>
              <FormikInput
                label="Responsável"
                name="responsible"
                value={values.responsible}
                error={touched.responsible && errors.responsible ? errors.responsible : null}
                placeholder="Ex: Equipe de manutenção local"
              />

              <FormikInput
                label="Fonte"
                name="source"
                value={values.source}
                error={touched.source && errors.source ? errors.source : null}
                placeholder="Ex: NBR 5674:2012"
              />

              <FormikInput
                label="Observação"
                name="observation"
                value={values.observation}
                error={touched.observation && errors.observation ? errors.observation : null}
                placeholder="Ex: Atenção no acabamento"
              />

              <Style.SelectWrapper>
                <FormikInput
                  label="Prazo para execução"
                  name="period"
                  value={values.period}
                  error={touched.period && errors.period ? errors.period : null}
                  placeholder="Ex: 10"
                  maxLength={4}
                  onChange={(e) => {
                    setFieldValue(
                      'period',
                      applyMask({ mask: 'NUM', value: e.target.value }).value,
                    );
                  }}
                />

                <FormikSelect
                  selectPlaceholderValue={values.periodTimeInterval}
                  name="periodTimeInterval"
                  label="Unidade"
                  arrowColor="primary"
                  error={
                    touched.periodTimeInterval && errors.periodTimeInterval
                      ? errors.periodTimeInterval
                      : null
                  }
                >
                  <option value="Selecione" disabled hidden>
                    Selecione
                  </option>
                  {timeIntervals.map((element) => (
                    <option key={element.id} value={element.id}>
                      {Number(values.period) > 1
                        ? capitalizeFirstLetter(element.pluralLabel)
                        : capitalizeFirstLetter(element.singularLabel)}
                    </option>
                  ))}
                </FormikSelect>
              </Style.SelectWrapper>

              <FormikSelect
                selectPlaceholderValue={values.priorityName}
                name="priorityName"
                label="Prioridade"
                arrowColor="primary"
                error={touched.priorityName && errors.priorityName ? errors.priorityName : null}
              >
                <option value="" disabled>
                  Selecione
                </option>

                {maintenancePriorities.map((priority) => (
                  <option key={priority.name} value={priority.name}>
                    {priority.label}
                  </option>
                ))}
              </FormikSelect>

              <MaintenanceInstructionsComponent
                instructions={values.instructions}
                onFileQuery={onFileQuery}
                setFieldValue={setFieldValue}
                setOnFileQuery={setFileOnQuery}
              />

              {/* <Style.SelectWrapper>
                <Style.DelayIcon title="Tempo para iniciar a notificação após a entrega da obra.">
                  <FormikInput
                    label="Delay"
                    name="delay"
                    value={values.delay}
                    error={touched.delay && errors.delay ? errors.delay : null}
                    placeholder="Ex: 1"
                    maxLength={4}
                    onChange={(e) => {
                      setFieldValue(
                        'delay',
                        applyMask({ mask: 'NUM', value: e.target.value }).value,
                      );
                    }}
                  />
                  <Image img={icon.alert} size="16px" />
                </Style.DelayIcon>

                <FormikSelect
                  selectPlaceholderValue={values.delayTimeInterval}
                  name="delayTimeInterval"
                  label="Unidade"
                  error={
                    touched.delayTimeInterval && errors.delayTimeInterval
                      ? errors.delayTimeInterval
                      : null
                  }
                >
                  <option value="Selecione" disabled hidden>
                    Selecione
                  </option>
                  {timeIntervals.map((element) => (
                    <option key={element.id} value={element.id}>
                      {Number(values.delay) > 1
                        ? capitalizeFirstLetter(element.pluralLabel)
                        : capitalizeFirstLetter(element.singularLabel)}
                    </option>
                  ))}
                </FormikSelect>
              </Style.SelectWrapper> */}

              <Style.ButtonContainer buttonsAlign={!onQuery}>
                {!onQuery && (
                  <PopoverButton
                    actionButtonBgColor={theme.color.actionDanger}
                    borderless
                    textColor="actionDanger"
                    type="Button"
                    label="Excluir"
                    message={{
                      title: 'Deseja excluir esta manutenção?',
                      content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                      contentColor: theme.color.danger,
                    }}
                    actionButtonClick={() => {
                      requestDeleteMaintenance({
                        maintenanceId: selectedMaintenance.id,
                        setOnQuery,
                        setModal,
                        categories,
                        setCategories,
                        categoryId,
                      });
                    }}
                  />
                )}
                <Button
                  label="Salvar"
                  type="submit"
                  loading={onQuery}
                  disable={onFileQuery}
                  bgColor="primary"
                />
              </Style.ButtonContainer>
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
