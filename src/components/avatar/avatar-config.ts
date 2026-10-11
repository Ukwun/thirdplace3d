/**
 * Local player avatar asset contract.
 *
 * Replace `assetPath: null` with `/assets/avatars/local-player.glb` after placing
 * the exported GLB at `public/assets/avatars/local-player.glb`. One world unit
 * represents one metre; models are normalized to a 1.25 m runtime height.
 *
 * The rig must be one deforming humanoid skeleton with pelvis/hips, spine, chest,
 * neck, head, left/right upper and lower arms plus hands, and left/right upper
 * and lower legs plus feet. Bone names may vary, but the mesh and clips must use
 * the same rig. Export the avatar facing local +Z (the current placeholder's
 * forward); use `yawCorrectionRadians` only if the source faces another way.
 *
 * Include embedded `Idle` and `Walk` (or `Walking`) clips. Names are matched
 * case-insensitively after removing spaces, underscores, and hyphens. Keep the
 * walk cycle in place: world movement is driven by the local simulation. Export
 * glTF 2.0 Binary (.glb), Y-up, with transforms applied, one armature, embedded
 * textures/materials, and no external file references. Keep the feet at the
 * ground plane; runtime normalization centers the model and places its feet at
 * y=0. Avoid root-motion translations in animation clips.
 */

export type AvatarAppearance = {
  skinTone: string;
  hairTone: string;
  clothingTone: string;
  hairStyle: "short-coils" | "close-cropped" | "braids";
  accessories: string[];
};

export type LocalAvatarConfig = {
  assetPath: string | null;
  targetHeightMeters: number;
  yawCorrectionRadians: number;
  animationClips: { idle: string[]; walk: string[] };
  appearance: AvatarAppearance;
};

export const LOCAL_AVATAR_CONFIG: LocalAvatarConfig = {
  // Leave null until the GLB is supplied; this keeps the working placeholder active.
  assetPath: null,
  targetHeightMeters: 1.25,
  yawCorrectionRadians: 0,
  animationClips: {
    idle: ["Idle", "Idle_01"],
    walk: ["Walk", "Walking", "Walk_Cycle"],
  },
  appearance: {
    skinTone: "#8a5238",
    hairTone: "#202b2a",
    clothingTone: "#df704d",
    hairStyle: "short-coils",
    accessories: [],
  },
};
