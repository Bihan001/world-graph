import { Request, Response } from 'express';
import { SuccessResponse } from '../utils/response-handler';
import catchAsync from '../utils/catch-async';
import CustomError from '../errors/custom-error';
import { regionsData } from '../data/regions';
import { algorithmsData } from '../data/algorithms';
import { LatLon } from '../utils/interfaces/graph';
import { handleAlgorithmExec } from '../algorithms/algorithm-handler';

// @method GET
export const rootMainController = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse({}, 'Main Route is up and running!'));
});

// @method GET
export const getAllRegions = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse(regionsData, 'Fetched regions successfully'));
});

// @method GET
export const getAllAlgorithms = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse(algorithmsData, 'Fetched regions successfully'));
});

// @method POST
export const execAlgorithm = catchAsync(async (req: Request, res: Response) => {
  const region: string = req.body.region;
  const algorithm: string = req.body.algorithm;
  const pointA: LatLon = req.body.pointA;
  const pointB: LatLon = req.body.pointB;

  if (!region) throw new CustomError('A region must be selected', 400);
  if (!algorithm) throw new CustomError('An algorithm must be selected', 400);
  if (!pointA || !pointB || isNaN(pointA.lat) || isNaN(pointA.lon) || isNaN(pointB.lat) || isNaN(pointB.lon)) {
    throw new CustomError('Coordinates of both points must be present', 400);
  }

  const result = handleAlgorithmExec(region, algorithm, pointA, pointB);
  if (result instanceof Error) throw new CustomError(result.message, 500);
  const { edges, allEdges } = result;
  res.status(200).json(SuccessResponse({ edges, allEdges }, 'Success'));
});
