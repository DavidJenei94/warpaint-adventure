import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Route } from '../models/route.model';

type RouteState = {
  route: Route;
  routeSections: GeoJSON.FeatureCollection<any>[];
  nodes: number[][];
};

const initialRouteState: RouteState = {
  route: {
    id: 0,
    name: '',
    path: '',
    color: 'blue',
  },
  routeSections: [],
  nodes: [],
};

const routeSlice = createSlice({
  name: 'route',
  initialState: initialRouteState,
  reducers: {
    setRoute: (state, action: PayloadAction<Route>) => {
      state.route = action.payload
    },
    setRouteSections: (state, action) => {
      state.routeSections = action.payload;
    },
    addRouteSection: (
      state,
      action: PayloadAction<GeoJSON.FeatureCollection<any>>
    ) => {
      state.routeSections.push(action.payload);
    },
    insertRouteSection: (
      state,
      action: PayloadAction<{
        index: number;
        deleteCount: number;
        insertElement?: GeoJSON.FeatureCollection<any>;
      }>
    ) => {
      const payload = action.payload;
      if (payload.insertElement) {
        state.routeSections.splice(
          payload.index,
          payload.deleteCount,
          payload.insertElement
        );
      } else {
        state.routeSections.splice(payload.index, payload.deleteCount);
      }
    },
    updateRouteSection: (
      state,
      action: PayloadAction<{
        index: number;
        routeSection: GeoJSON.FeatureCollection<any>;
      }>
    ) => {
      const payload = action.payload;
      state.routeSections[payload.index] = payload.routeSection;
    },
    deleteRouteSection: (state, action: PayloadAction<number>) => {
      state.routeSections.splice(action.payload, 1);
    },
    resetRouteSections: (state) => {
      state.routeSections = [];
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<number[]>) => {
      state.nodes.push([action.payload[0], action.payload[1]]);
    },
    insertNode: (
      state,
      action: PayloadAction<{
        index: number;
        deleteCount: number;
        insertElement?: number[];
      }>
    ) => {
      const payload = action.payload;
      if (payload.insertElement) {
        state.nodes.splice(
          payload.index,
          payload.deleteCount,
          payload.insertElement
        );
      } else {
        state.nodes.splice(payload.index, payload.deleteCount);
      }
    },
    updateNode: (
      state,
      action: PayloadAction<{ index: number; coordinates: number[] }>
    ) => {
      const payload = action.payload;
      state.nodes[payload.index] = [
        payload.coordinates[0],
        payload.coordinates[1],
      ];
    },
    deleteNode: (state, action: PayloadAction<number>) => {
      state.nodes.splice(action.payload, 1);
    },
    resetNodes: (state) => {
      state.nodes = [];
    },
  },
});

export const routeActions = routeSlice.actions;

export default routeSlice.reducer;
