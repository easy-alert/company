// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '../../../../../../../../components/Buttons/Button';
import { FormikTextArea } from '../../../../../../../../components/Form/FormikTextArea';
import { FormikInput } from '../../../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../../../components/Modal';
import { Image } from '../../../../../../../../components/Image';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../../../assets/icons';

// TYPES
import { IModalCreateMaintenance } from './utils/types';

// FUNCTIONS
import { schemaCreateMaintenance, requestCreateMaintenance } from './utils/functions';
import { applyMask, capitalizeFirstLetter } from '../../../../../../../../utils/functions';

import { FormikSelect } from '../../../../../../../../components/Form/FormikSelect';
import { FormikCheckbox } from '../../../../../../../../components/Form/FormikCheckbox';

export const ModalCreateMaintenance = ({
  setModal,
  categoryId,
  categories,
  setCategories,
  timeIntervals,
  categoriesOptions,
}: IModalCreateMaintenance) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Criar manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          customCategoryId: categoryId,
          element: '',
          activity: '',
          frequency: '',
          frequencyTimeInterval: 'Selecione',
          responsible: '',
          source: '',
          period: '',
          periodTimeInterval: 'Selecione',
          delay: '0',
          delayTimeInterval: timeIntervals[0].id,
          observation: '',
          createAgain: false,
        }}
        validationSchema={schemaCreateMaintenance}
        onSubmit={async (values, actions) => {
          requestCreateMaintenance({
            values,
            setModal,
            categories,
            setCategories,
            setOnQuery,
            setFieldValue: actions.setFieldValue,
            defaultDelayIntervalId: timeIntervals[0].id,
            resetForm: actions.resetForm,
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
                maxLength={300}
              />

              <FormikTextArea
                label="Atividade"
                name="activity"
                value={values.activity}
                error={touched.activity && errors.activity ? errors.activity : null}
                placeholder="Ex: Verificar sua integridade e reconstruir os rejuntamentos internos e externos dos pisos"
                height="82px"
                maxLength={300}
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
                maxLength={80}
              />

              <FormikInput
                label="Fonte"
                name="source"
                value={values.source}
                error={touched.source && errors.source ? errors.source : null}
                placeholder="Ex: NBR 5674:2012"
                maxLength={80}
              />

              <FormikInput
                label="Observação"
                name="observation"
                value={values.observation}
                error={touched.observation && errors.observation ? errors.observation : null}
                placeholder="Ex: Atenção no acabamento"
                maxLength={200}
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
              <Style.SelectWrapper>
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
              </Style.SelectWrapper>
              <FormikCheckbox name="createAgain" label="Salvar e criar outra" />
              <Button center label="Criar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
