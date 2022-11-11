// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '../../../../../../../../components/Buttons/Button';
import { FormikTextArea } from '../../../../../../../../components/Form/FormikTextArea';
import { FormikInput } from '../../../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../../../components/Modal';
import * as Style from './styles';
import { FormikSelect } from '../../../../../../../../components/Form/FormikSelect';

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

export const ModalEditMaintenance = ({
  setModal,
  selectedMaintenance,
  timeIntervals,
  categories,
  setCategories,
  categoryId,
}: IModalEditMaintenance) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Editar manutenção" setModal={setModal}>
      <Formik
        initialValues={{
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
          observation: selectedMaintenance.observation ?? '',
        }}
        validationSchema={schemaEditMaintenance}
        onSubmit={async (values) => {
          requestEditMaintenance({
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
              <FormikTextArea
                label="Elemento"
                name="element"
                value={values.element}
                error={touched.element && errors.element ? errors.element : null}
                placeholder="Rejuntamento e vedações"
                height="60px"
                maxLength={150}
              />

              <FormikTextArea
                label="Atividade"
                name="activity"
                value={values.activity}
                error={touched.activity && errors.activity ? errors.activity : null}
                placeholder="Verificar sua integridade e reconstruir os rejuntamentos internos e externos dos pisos"
                height="82px"
                maxLength={180}
              />
              <Style.SelectWrapper>
                <FormikInput
                  label="Periodicidade"
                  name="frequency"
                  value={values.frequency}
                  error={touched.frequency && errors.frequency ? errors.frequency : null}
                  placeholder="1"
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
                  label="Intervalo"
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
                placeholder="Equipe de manutenção local"
                maxLength={40}
              />

              <FormikInput
                label="Fonte"
                name="source"
                value={values.source}
                error={touched.source && errors.source ? errors.source : null}
                placeholder="NBR 5674:2012"
                maxLength={40}
              />

              <FormikInput
                label="Observação"
                name="observation"
                value={values.observation}
                error={touched.observation && errors.observation ? errors.observation : null}
                placeholder="Atenção no acabamento"
                maxLength={55}
              />
              <Style.SelectWrapper>
                <FormikInput
                  label="Tempo para resposta"
                  name="period"
                  value={values.period}
                  error={touched.period && errors.period ? errors.period : null}
                  placeholder="10"
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
                  label="Intervalo"
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
              <Style.SelectWrapper>
                <FormikInput
                  label="Delay"
                  name="delay"
                  value={values.delay}
                  error={touched.delay && errors.delay ? errors.delay : null}
                  placeholder="1"
                  maxLength={4}
                  onChange={(e) => {
                    setFieldValue('delay', applyMask({ mask: 'NUM', value: e.target.value }).value);
                  }}
                />
                <FormikSelect
                  selectPlaceholderValue={values.delayTimeInterval}
                  name="delayTimeInterval"
                  label="Intervalo"
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
              </Style.SelectWrapper>
              <Style.ButtonContainer>
                {!onQuery && (
                  <PopoverButton
                    actionButtonBgColor={theme.color.primary}
                    borderless
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
                <Button label="Editar" type="submit" loading={onQuery} />
              </Style.ButtonContainer>
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
