/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EpisodeController } from './../controllers/episode.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Info": {
        "dataType": "refObject",
        "properties": {
            "count": {"dataType":"double","required":true},
            "pages": {"dataType":"double","required":true},
            "next": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "prev": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Episode": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "air_date": {"dataType":"string","required":true},
            "episode": {"dataType":"string","required":true},
            "characters": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "url": {"dataType":"string","required":true},
            "created": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EpisodesResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "info": {"ref":"Info","required":true},
            "results": {"dataType":"array","array":{"dataType":"refObject","ref":"Episode"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Episode.Exclude_keyofEpisode.characters__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"air_date":{"dataType":"string","required":true},"episode":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"created":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Episode.characters_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Episode.Exclude_keyofEpisode.characters__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Character": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "species": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "gender": {"dataType":"string","required":true},
            "origin": {"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},
            "location": {"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},
            "image": {"dataType":"string","required":true},
            "episode": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "url": {"dataType":"string","required":true},
            "created": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetCharactersByEpisodeIdResponseDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_Episode.characters_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"characters":{"dataType":"array","array":{"dataType":"refObject","ref":"Character"},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsEpisodeController_list: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                name: {"in":"query","name":"name","dataType":"string"},
                episode: {"in":"query","name":"episode","dataType":"string"},
        };
        app.get('/episodes',
            ...(fetchMiddlewares<RequestHandler>(EpisodeController)),
            ...(fetchMiddlewares<RequestHandler>(EpisodeController.prototype.list)),

            async function EpisodeController_list(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEpisodeController_list, request, response });

                const controller = new EpisodeController();

              await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEpisodeController_get: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/episodes/:id',
            ...(fetchMiddlewares<RequestHandler>(EpisodeController)),
            ...(fetchMiddlewares<RequestHandler>(EpisodeController.prototype.get)),

            async function EpisodeController_get(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEpisodeController_get, request, response });

                const controller = new EpisodeController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEpisodeController_getCharactersByEpisodeId: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                page: {"in":"query","name":"page","dataType":"double"},
                name: {"in":"query","name":"name","dataType":"string"},
                status: {"in":"query","name":"status","dataType":"union","subSchemas":[{"dataType":"enum","enums":["alive"]},{"dataType":"enum","enums":["dead"]},{"dataType":"enum","enums":["unknown"]}]},
                species: {"in":"query","name":"species","dataType":"string"},
                type: {"in":"query","name":"type","dataType":"string"},
                gender: {"in":"query","name":"gender","dataType":"union","subSchemas":[{"dataType":"enum","enums":["female"]},{"dataType":"enum","enums":["male"]},{"dataType":"enum","enums":["genderless"]},{"dataType":"enum","enums":["unknown"]}]},
        };
        app.get('/episodes/:id/characters',
            ...(fetchMiddlewares<RequestHandler>(EpisodeController)),
            ...(fetchMiddlewares<RequestHandler>(EpisodeController.prototype.getCharactersByEpisodeId)),

            async function EpisodeController_getCharactersByEpisodeId(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEpisodeController_getCharactersByEpisodeId, request, response });

                const controller = new EpisodeController();

              await templateService.apiHandler({
                methodName: 'getCharactersByEpisodeId',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
