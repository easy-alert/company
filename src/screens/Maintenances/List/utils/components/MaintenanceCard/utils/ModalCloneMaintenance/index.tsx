// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '../../../../../../../../components/Buttons/Button';
import { FormikTextArea } from '../../../../../../../../components/Form/FormikTextArea';
import { FormikInput } from '../../../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../../../components/Modal';
import * as Style from './styles';

// TYPES
import { IModalCloneMaintenance } from './utils/types';

// FUNCTIONS
import { schemaCloneMaintenance, requestCloneMaintenance } from './utils/functions';
import { applyMask, capitalizeFirstLetter } from '../../../../../../../../utils/functions';

import { FormikSelect } from '../../../../../../../../components/Form/FormikSelect';
import { MaintenanceInstructionsComponent } from '../../../../../../../../components/MaintenanceInstructionsComponent';

export const ModalCloneMaintenance = ({
  setModal,
  categoryId,
  categories,
  setCategories,
  timeIntervals,
  maintenance,
  categoriesOptions,
  maintenancePriorities,
}: IModalCloneMaintenance) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onFileQuery, setFileOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Clonar manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          customCategoryId: categoryId,
          element: maintenance.element,
          activity: maintenance.activity,
          frequency: String(maintenance.frequency),
          frequencyTimeInterval: maintenance.FrequencyTimeInterval.id,
          responsible: maintenance.responsible,
          source: maintenance.source.includes('adaptada')
            ? maintenance.source
            : `${maintenance.source} [adaptada]`,
          period: String(maintenance.period),
          periodTimeInterval: maintenance.PeriodTimeInterval.id,
          delay: String(maintenance.delay),
          delayTimeInterval: maintenance.DelayTimeInterval.id,
          priorityName: maintenance.priorityName,
          observation:
            maintenance.observation && maintenance.observation !== ''
              ? maintenance.observation
              : '',
          instructions: maintenance.instructions
            ? maintenance.instructions.map(({ name, url }) => ({ name, url }))
            : [],
        }}
        validationSchema={schemaCloneMaintenance}
        onSubmit={async (values) => {
          requestCloneMaintenance({
            values,
            setModal,
            categories,
            setCategories,
            setOnQuery,
            maintenance,
          });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              <FormikSelect
                label="Categoria"
                name="customCategoryId"
                selectPlaceholderValue={values.customCategoryId}
                value={values.customCategoryId}
              >
                {categoriesOptions.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.name}
                  </option>
                ))}
              </FormikSelect>

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
                <FormikInput
                  label="Delay"
                  name="delay"
                  value={values.delay}
                  error={touched.delay && errors.delay ? errors.delay : null}
                  placeholder="Ex: 1"
                  maxLength={4}
                  onChange={(e) => {
                    setFieldValue('delay', applyMask({ mask: 'NUM', value: e.target.value }).value);
                  }}
                />
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

              <Button center label="Clonar" type="submit" loading={onQuery} bgColor="primary" />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
