import React from "react";
import { Table, GetCircleStatusOrderTransaction, Icons } from "../../../components";
import moment from 'moment';

const List = ({data, ...props}) => {  
  return (
      <Table
        headers={[                 
          "Vencimento",          
          "Status",
          " ",      
        ]}        
      >
        {data.map((item, rowIndex) => (
          <Table.tr key={`row${rowIndex}`} onClick={()=>{
            window.open(
              process.env.REACT_APP_INVOICE_PATH+`/fatura/${item.external_id}`,
              '_blank'
            );
          }}>            
            <Table.td>{moment(item.due_date).format('DD/MM/YYYY')}</Table.td>
            <Table.td><GetCircleStatusOrderTransaction status={item.status} /></Table.td>
            <Table.td><Icons.next fill="#4d4d4d" /></Table.td>                         
          </Table.tr>
        ))}
      </Table>
  );
};

export default List;
