## Apresentação

Nesse projeto, apresento uma demanda que tive em um projeto de BI e como atendi a ela utilizando as ferramentas disponíveis no cenário descrito.

## Demanda

A secretaria de governo em que eu trabalho é responsável por realizar uma audiência pública para apresentar o andamento das metas das demais secretarias.
Essa apresentação deveria consolidar os dados de todas as secretárias em um único painel feito em Power BI que pudesse ser utilizado na apresentação e que ficasse disponível para a população em geral.
Além dos dados referentes a essas metas, deveria ser possível apresentar algumas fotos que ilustrassem as respectivas ações que estavam sendo desenvolvidas.

O cenário era o seguinte: cada secretaria teria uma pasta no Google Drive e deveria preencher as seguintes informações:
- planilha com os dados de realização das metas
- imagens que ilustrassem as respectivas ações

Na estrutura atual só teríamos disponíveis o Power BI e as ferramentas do Google que a secretaria utiliza.

## Desafios

Com base no cenário e nas ferramentas disponíveis tive os seguintes desafios:
- Para apresentar as fotos no Power BI, os arquivos deveriam estar com a opção de compartilhamento no Google Drive do tipo "Público". Como fazer isso em massa e de tempos em tempos?
- As fotos poderiam ser adicionadas/modificadas a qualquer momento e assim o link delas no Google Drive seria criado/modificado. Como consultar esses links em massa para estar sempre com o atual?


## Solução

Já estava me preparando para criar um projeto em Python para resolver esses desafios quando durante uma pesquisa de como conectar com o Google Drive descobri a ferramenta [Apps Scripts](https://developers.google.com/apps-script) do Google.

O Apps Script é uma ferramenta na nuvem que permite integrar e automatizar tarefas em todos os produtos do Google utilizando códigos em JavaScript.
Assim consegui facilmente transpor os desafios do projeto de uma forma simples, rápida e com as ferramentas que eu tinha.

## Liberar Perissão para Público

Para resolver o desafio de liberar o acesso dos arquivos de imagens para público, criei um projeto no Apps Script com o código que pode ser consultado na integra [aqui](https://github.com/laismeuchi/dados-gappsscript-example/blob/main/liberar_permissao_publico.js).

O script basicamente consulta a pasta informada varrendo todos os arquivos e subpastas, alterando a permissão dos arquivos de imagem para o tipo público:

```javascript
 function scanFolderAndSetPermissions(folder) {
    // Get all files in the current folder
    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      if (imageFileTypes.includes(file.getMimeType())) {
        // Set the file permission to public
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        Logger.log("Set public permission for file: " + file.getName());
      }
    }
```

Assim as imagens poderiam ser utilizadas no Power BI para visualização.

## Listar Links das Imagens

Para resolver o desafio de resgatar o link das fotos criei um outro projeto no Apps Script com o com o código que pode ser consultado na integra [aqui](https://github.com/laismeuchi/dados-gappsscript-example/blob/main/listar_links_imagens.js).

Esse script consulta a pasta informada varrendo todos os arquivos e subpastas, buscando por arquivos de imagem e salvando o nome do arquivo e o link em uma planilha também indicada na execução do script:

```javascript
function scanFolder(folder) {
    // Get all files in the current folder
    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      if (imageFileTypes.includes(file.getMimeType())) {
        // Split file name by period, if it has more than one part, remove the last part (extension)
        const fileNameParts = file.getName().split('.');
        const fileName = fileNameParts.length > 1 ? fileNameParts.slice(0, -1).join('.') : file.getName();
        // Construct the thumbnail URL
        const thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`;
        // Add the file name and thumbnail URL to the array
        imageDetails.push([fileName, thumbnailUrl]);
      }
    }
```

Essa planilha é consultada pelo Power BI que faz o vínculo com a respectiva meta na planilha e apresenta a imagem.

Aqui também ajustei o link da imagem para que ele ficasse no formato que o Power BI precisa para exibir a imagem no painel, assim resolvi outro desafio que descobri na utilização de elementos de imagens no Power BI.


## Considerações Finais

Os scripts foram agendados para execução antes da atualização do Power BI, assim os arquivos já terão a permissão liberada e os links salvos na planilha de consulta.

Algumas melhorias poderiam ser realizadas nesse projeto, como a criação de um projeto só com as duas operações e até a utilização da API para execução deles sem a necessidade de execução agendada.
Porém como a previsão é de que a próxima apresentação seja realizada consultando uma base de um sistema da secretaria, deixei ele dessa forma para atender somente essa primeira apresentação.

Nesse cenário o Apps Script resolveu muito bem meus desafios e auxiliou a entrega do projeto no tempo e com os requisitos solicitados pelo usuário, sem precisar criar ambiente específico para a demanda e nem outra ferramenta fora do que a secretária já dispõe.

Nem sempre dispomos das ferramentas que gostaríamos de utilizar em nossos projetos e em alguns casos o esforço é maior do que o projeto precisa naquele momento.
Então buscar soluções simples e aderentes ao problema é sempre uma boa pedida.

A apresentação ainda não foi realizada, assim que ela acontecer eu coloco aqui o link do painel para vocês poderem visualizar também.






