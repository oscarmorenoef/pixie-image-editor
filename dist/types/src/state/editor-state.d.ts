import { Canvas } from 'fabric/fabric-impl';
import type { Pixie } from '../pixie';
import type { PixieConfig } from '../config/default-config';
import type { PlainRect } from '@ui/utils/dom/get-bounding-client-rect';
import type { ToolName } from '../tools/tool-name';
import { RefObject } from 'react';
export type LoadingType = 'newCanvas' | 'mainImage' | 'state' | 'merge' | false;
export declare enum ActiveToolOverlay {
    Filter = "filter",
    Frame = "frame",
    ActiveObject = "activeObj",
    Text = "text"
}
export type EditorState = {
    editor: Pixie;
    fabric: Canvas;
    config: PixieConfig;
    setConfig: (partialConfig: Partial<PixieConfig>) => void;
    loading: LoadingType;
    openPanels: {
        newImage: boolean;
        history: boolean;
        objects: boolean;
        export: boolean;
    };
    zoom: number;
    original: {
        width: number;
        height: number;
    };
    stageSize: PlainRect;
    canvasSize: PlainRect;
    setCanvasSize: (size: PlainRect) => void;
    canvasRef: RefObject<HTMLElement> | null;
    activeTool: ToolName | null;
    activeToolOverlay: ActiveToolOverlay | null;
    dirty: boolean;
    cancelChanges: () => void;
    applyChanges: () => void;
    setZoom: (zoom: number) => void;
    setOriginal: (width: number, height: number) => void;
    setDirty: (isDirty: boolean) => void;
    toggleLoading: (loading: LoadingType) => void;
    setStageSize: (size: PlainRect) => void;
    togglePanel: (name: keyof EditorState['openPanels'], isOpen?: boolean) => void;
    setActiveTool: (tool: ToolName | null, overlay: ActiveToolOverlay | null) => void;
    reset: () => void;
};
