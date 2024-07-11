/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
// #region imports
// COMPONENTS
import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/Modal';
// TYPES
import { IModalPrintQRCode } from './types';
// STYLES
import * as Style from './styles';
// FUNCTIONS
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { DotSpinLoading } from '../../../../components/Loadings/DotSpinLoading';
import { LoadingWrapper } from '../../../../components/Loadings/LoadingWrapper';

// Font.register({
//   family: 'DMSans',
//   format: 'truetype',
//   fonts: [
//     {
//       src: DMSansRegular,
//     },
//     {
//       src: DMSansMedium,
//       fontWeight: 500,
//     },
//     {
//       src: DMSansBold500,
//       fontWeight: 700,
//     },
//   ],
// });
// #endregion

// #region pdf
// const MyDocument = ({
//   setLoading,
//   maintenancesForPDF,
//   companyImage,
//   filterforPDF,
//   counts,
// }: {
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   maintenancesForPDF: IMaintenanceForPDF[];
//   companyImage: string;
//   filterforPDF: IFilterforPDF;
//   counts: ICounts;
// }) => {
//   const randomNumber = () => {
//     let result = '';
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const charactersLength: number = characters.length;

//     for (let i = 0; i < 9; i += 1) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }

//     return result;
//   };

//   return (
//     <Document
//       onRender={() => {
//         setLoading(false);
//       }}
//     >
//       <Page size="A4" style={Style.pdf.page} orientation="landscape">
//         <View>
//           {
//             // #region Header
//             <View fixed style={Style.pdf.header}>
//               <View style={Style.pdf.headerSide}>
//                 <Image
//                   src={`${companyImage}?noCache=${Math.random().toString()}`}
//                   style={Style.pdf.companyLogo}
//                 />

//                 <View style={Style.pdf.headerColumn}>
//                   <Text>
//                     <Text style={Style.pdf.bold500}>Edificação:</Text>{' '}
//                     {`${filterforPDF.buildingNames ? filterforPDF.buildingNames : 'Todas'}`}
//                   </Text>

//                   <Text>
//                     <Text style={Style.pdf.bold500}>Categoria:</Text>{' '}
//                     {`${filterforPDF.categoryNames ? filterforPDF.categoryNames : 'Todas'}`}
//                   </Text>

//                   <Text>
//                     <Text style={Style.pdf.bold500}>Status:</Text>{' '}
//                     {`${filterforPDF.statusNames ? filterforPDF.statusNames : 'Todos'}`}
//                   </Text>

//                   <Text>
//                     <Text style={Style.pdf.bold500}>Período:</Text>{' '}
//                     {filterforPDF.startDate && filterforPDF.endDate
//                       ? `${new Date(
//                           new Date(filterforPDF.startDate).setUTCHours(3, 0, 0, 0),
//                         ).toLocaleDateString('pt-BR')} a ${new Date(
//                           new Date(filterforPDF.endDate).setUTCHours(3, 0, 0, 0),
//                         ).toLocaleDateString('pt-BR')}`
//                       : 'Todos'}
//                   </Text>
//                 </View>
//               </View>

//               <View style={Style.pdf.headerColumn}>
//                 <Text>
//                   <Text style={Style.pdf.bold500}>ID:</Text> {randomNumber()}
//                 </Text>

//                 <Text>
//                   <Text style={Style.pdf.bold500}>Emissão:</Text>{' '}
//                   {new Date().toLocaleString('pt-BR')}
//                 </Text>
//               </View>
//             </View>
//             // #endregion
//           }

//           {
//             // #region Body
//             <>
//               <View style={Style.pdf.body}>
//                 {maintenancesForPDF.map(({ data, month }) => (
//                   <View style={Style.pdf.cardWrapper} key={month}>
//                     <Text style={Style.pdf.month}>{month}</Text>
//                     {data.map((maintenance) => (
//                       <View style={Style.pdf.cardRow} key={month} wrap={false}>
//                         <View style={Style.pdf.cardDateColumn}>
//                           <Text>
//                             {String(new Date(maintenance.notificationDate).getDate()).padStart(
//                               2,
//                               '0',
//                             )}
//                           </Text>
//                           <Text>
//                             {capitalizeFirstLetter(
//                               new Date(maintenance.notificationDate)
//                                 .toLocaleString('pt-br', {
//                                   weekday: 'long',
//                                 })
//                                 .substring(0, 3),
//                             )}
//                           </Text>
//                         </View>

//                         <View style={Style.pdf.card}>
//                           <View
//                             style={{
//                               ...Style.pdf.tag,
//                               backgroundColor: getStatusBackgroundColor(
//                                 maintenance.status === 'overdue' ? 'completed' : maintenance.status,
//                               ),
//                             }}
//                           />

//                           <View style={Style.pdf.content}>
//                             <View style={Style.pdf.contentHeader}>
//                               <Text>{maintenance.buildingName}</Text>

//                               <View style={Style.pdf.tagsRow}>
//                                 {maintenance.status === 'overdue' && (
//                                   <Text
//                                     style={{
//                                       ...Style.pdf.maintenanceTag,
//                                       backgroundColor: getStatusBackgroundColor('completed'),
//                                     }}
//                                   >
//                                     {getSingularStatusNameforPdf('completed')}
//                                   </Text>
//                                 )}
//                                 <Text
//                                   style={{
//                                     ...Style.pdf.maintenanceTag,
//                                     backgroundColor: getStatusBackgroundColor(maintenance.status),
//                                   }}
//                                 >
//                                   {getSingularStatusNameforPdf(maintenance.status)}
//                                 </Text>

//                                 {maintenance.type === 'occasional' && (
//                                   <Text
//                                     style={{
//                                       ...Style.pdf.maintenanceTag,
//                                       backgroundColor: getStatusBackgroundColor('occasional'),
//                                     }}
//                                   >
//                                     Avulsa
//                                   </Text>
//                                 )}

//                                 {maintenance.inProgress && (
//                                   <Text
//                                     style={{
//                                       ...Style.pdf.maintenanceTag,
//                                       backgroundColor: getStatusBackgroundColor('inProgress'),
//                                     }}
//                                   >
//                                     Em execução
//                                   </Text>
//                                 )}
//                               </View>
//                             </View>

//                             <View style={Style.pdf.contentData}>
//                               <View style={Style.pdf.contentColumn1}>
//                                 <Text style={Style.pdf.bold500}>
//                                   Categoria:{' '}
//                                   <Text style={Style.pdf.normal}>{maintenance.categoryName}</Text>
//                                 </Text>

//                                 <Text style={Style.pdf.bold500}>
//                                   Elemento:{' '}
//                                   <Text style={Style.pdf.normal}>{maintenance.element}</Text>
//                                 </Text>

//                                 <Text style={Style.pdf.bold500}>
//                                   Atividade:{' '}
//                                   <Text style={Style.pdf.normal}>{maintenance.activity}</Text>
//                                 </Text>
//                               </View>

//                               <View style={Style.pdf.contentColumn2}>
//                                 <Text style={Style.pdf.bold500}>
//                                   Notificação:{' '}
//                                   <Text style={Style.pdf.normal}>
//                                     {dateFormatter(maintenance.notificationDate)}
//                                   </Text>
//                                 </Text>

//                                 <Text style={Style.pdf.bold500}>
//                                   Conclusão:{' '}
//                                   <Text style={Style.pdf.normal}>
//                                     {maintenance.resolutionDate
//                                       ? dateFormatter(maintenance.resolutionDate)
//                                       : '-'}
//                                   </Text>
//                                 </Text>

//                                 <Text style={Style.pdf.bold500}>
//                                   Responsável:{' '}
//                                   <Text style={Style.pdf.normal}>{maintenance.responsible}</Text>
//                                 </Text>

//                                 <Text style={Style.pdf.bold500}>
//                                   Valor:{' '}
//                                   <Text style={Style.pdf.normal}>
//                                     {' '}
//                                     {
//                                       applyMask({
//                                         value: String(maintenance.cost || 0),
//                                         mask: 'BRL',
//                                       }).value
//                                     }
//                                   </Text>
//                                 </Text>

//                                 <Text style={Style.pdf.bold500}>
//                                   Anexos ({maintenance.annexes.length}):{' '}
//                                   {maintenance.annexes.map(({ url, name }, annexIndex) => (
//                                     <View key={url}>
//                                       <Link src={url} style={Style.pdf.annex}>
//                                         {`${name}${
//                                           maintenance.annexes.length !== annexIndex + 1 ? ', ' : '.'
//                                         }`}
//                                       </Link>
//                                     </View>
//                                   ))}
//                                 </Text>
//                               </View>

//                               <View style={Style.pdf.contentColumn3}>
//                                 <Text style={Style.pdf.bold500}>
//                                   Imagens ({maintenance.images.length}):
//                                 </Text>
//                                 <View style={Style.pdf.images}>
//                                   {maintenance.images.slice(0, 4).map(({ url, base64 }) => (
//                                     <Link key={url} src={url} style={Style.pdf.image}>
//                                       <Image source={base64} />
//                                     </Link>
//                                   ))}
//                                 </View>
//                               </View>
//                             </View>
//                             <Text style={{ ...Style.pdf.bold500, width: 750 }}>
//                               Observação do relato:{' '}
//                               <Text style={Style.pdf.normal}>
//                                 {maintenance.reportObservation || '-'}
//                               </Text>
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     ))}
//                   </View>
//                 ))}
//               </View>

//               <View style={Style.pdf.countCard} wrap={false}>
//                 <View>
//                   <Text style={{ color: theme.color.success, fontSize: 12 }}>
//                     {counts.completed}
//                   </Text>
//                   <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
//                     {counts.completed > 1 ? 'Concluídas' : 'Concluída'}
//                   </Text>
//                 </View>
//                 <View>
//                   <Text style={{ color: theme.color.warning, fontSize: 12 }}>{counts.pending}</Text>
//                   <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
//                     {counts.pending > 1 ? 'Pendentes' : 'Pendente'}
//                   </Text>
//                 </View>
//                 <View>
//                   <Text style={{ color: theme.color.actionDanger, fontSize: 12 }}>
//                     {counts.expired}
//                   </Text>
//                   <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
//                     {counts.expired > 1 ? 'Vencidas' : 'Vencida'}
//                   </Text>
//                 </View>

//                 <Text style={{ marginLeft: 'auto' }}>
//                   Total: {applyMask({ value: String(counts.totalCost), mask: 'BRL' }).value}
//                 </Text>
//               </View>
//             </>
//             // #endregion
//           }
//         </View>

//         {
//           // #region Footer
//           <View fixed style={Style.pdf.footer}>
//             <Image source={image.logoForPDF} style={Style.pdf.easyAlertLogo} />
//             <Text
//               render={({ pageNumber, totalPages }) => `${`Página ${pageNumber} de ${totalPages}`}`}
//             />
//           </View>
//           // #endregion
//         }
//       </Page>
//     </Document>
//   );
// };
// #endregion

// #region modal
export const ModalPrintReport = ({ setModal, filters }: IModalPrintQRCode) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfLink, setPdfLink] = useState('');

  const requestReportsData = async () => {
    await Api.get(
      `/buildings/reports/list/pdf?maintenanceStatusIds=${filters.maintenanceStatusIds}&buildingIds=${filters.buildingIds}&categoryNames=${filters.categoryNames}&startDate=${filters.startDate}&endDate=${filters.endDate}&buildingNames=${filters.buildingNames}&maintenanceStatusNames=${filters.maintenanceStatusNames}`,
    )
      .then((res) => {
        setPdfLink(res.data.pdfLink);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    requestReportsData();
  }, []);

  return (
    <Modal bodyWidth="90vw" title="Relatório" setModal={setModal}>
      {loading ? (
        <LoadingWrapper minHeight="600px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Container src={pdfLink} />
      )}
    </Modal>
  );
};
// #endregion
