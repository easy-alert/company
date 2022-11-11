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
import { IModalCreateMaintenance } from './utils/types';

// FUNCTIONS
import { schemaCreateMaintenance, requestCreateMaintenance } from './utils/functions';
import { applyMask, capitalizeFirstLetter } from '../../../../../../../../utils/functions';

import { FormikSelect } from '../../../../../../../../components/Form/FormikSelect';

export const ModalCreateMaintenance = ({
  setModal,
  categoryId,
  categories,
  setCategories,
  timeIntervals,
}: IModalCreateMaintenance) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Criar manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          element: '',
          activity: '',
          frequency: '',
          frequencyTimeInterval: 'Selecione',
          responsible: '',
          source: '',
          period: '',
          periodTimeInterval: 'Selecione',
          delay: '',
          delayTimeInterval: 'Selecione',
          observation: '',
        }}
        validationSchema={schemaCreateMaintenance}
        onSubmit={async (values) => {
          requestCreateMaintenance({
            values,
            categoryId,
            setModal,
            categories,
            setCategories,
            setOnQuery,
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
              <Button center label="Criar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
