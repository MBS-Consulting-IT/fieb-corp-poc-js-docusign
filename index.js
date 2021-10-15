const alias = document.querySelector('#inpDsFlowElementAlias').value

const monitorarStatus = async () => {

  const parser = new DOMParser();
  "inpenvelopeId"
  const envId = document.querySelector('[ xname ="inpenvelopeId"]').value;
  console.log(envId);
  const response = await fetch(`http://192.168.0.206/fiebdev/Applications/wsassinatura/WSAssinatura.asmx/ConsutaRecipients?envID=${envId}`)
  const text = await response.text()
  const xmlDoc = parser.parseFromString(text,"text/xml");
  const Signers = xmlDoc.getElementsByTagName("Signers")[0].children;
  console.log(xmlDoc);
  const SignersArray = [...Signers]
            .map( item => {
              console.log( item.getElementsByTagName('SignedDateTime'));
              console.log( item.getElementsByTagName('RecipientId'));
              return [ 
                  //{ name: "Id", value: item.getElementsByTagName('UserId')[0].innerHTML },
                  { name: "Id do Recipient", value: item.getElementsByTagName('RecipientId')[0].innerHTML },
                  { name: "Nome", value: item.getElementsByTagName('Name')[0].innerHTML },
                  { name: "Status", value: item.getElementsByTagName('Status')[0].innerHTML },
                  { name: "Ordem de Envio", value: item.getElementsByTagName('RoutingOrder')[0].innerHTML },
                  { 
                    name: "Hora de Assinatura",
                    value:  item.getElementsByTagName('SignedDateTime').length ? item.getElementsByTagName('SignedDateTime')[0].innerHTML  : ''
                  },
                ]
            })

  SignersArray.forEach(
    signer => {
      let signerWrapper = document.createElement("div");
      signerWrapper.className = 'signer';

      signer.forEach( s => {
        let heading = document.createElement("h3");
        let data = document.createElement("span");
        heading.className = 'label-recipient';
        data.className = 'data-recipient';
        if( s.name === "Hora de Assinatura") {
          s.value = s.value ? new Date(s.value).toLocaleString('pt-BR') : 'Pendente';
        }

        let name = document.createTextNode(JSON.stringify(s.name).replace(/"/gi, ''));
        let value = document.createTextNode(JSON.stringify(s.value).replace(/"/gi, ''));
        
        heading.appendChild(name)
        data.appendChild(value)
        heading.appendChild(data)
        signerWrapper.append(heading)
      })
      document.querySelector("#ContainerForm").append(signerWrapper)
  })
            // .map( item => {
            //   return { 
            //     Id: item.getElementsByTagName('UserId')[0].innerHTML,
            //     RecipientId: item.getElementsByTagName('RecipientId')[0].innerHTML,
            //     Name: item.getElementsByTagName('Name')[0].innerHTML,
            //     Status: item.getElementsByTagName('Status')[0].innerHTML,
            //     RoutingOrder: item.getElementsByTagName('RoutingOrder')[0].innerHTML,
            //     SignedDateTime: item.getElementsByTagName('SignedDateTime')[0].innerHTML,
            //     SignedDateTime: item.getElementsByTagName('SignedDateTime')[0].innerHTML,
            //     }
            //   })
}

if (alias === 'monitorar')
  monitorarStatus().then((res) => console.log(res))
