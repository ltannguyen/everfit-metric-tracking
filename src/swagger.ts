import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const title = 'Swagger API';
const description = 'The Swagger API documents';

export const configureSwagger = (
  app: INestApplication,
  apiVersion: string,
  path: string,
  configure: (builder: DocumentBuilder) => void,
) => {
  const builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(apiVersion);

  configure(builder);

  const openApi = builder.build();
  const document = SwaggerModule.createDocument(app, openApi);

  SwaggerModule.setup(`${path}/swagger`, app, document);
};
