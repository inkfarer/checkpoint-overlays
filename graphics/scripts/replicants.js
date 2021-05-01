const DASHBOARD_BUNDLE_NAME = 'ipl-overlay-controls';

const SBData = nodecg.Replicant('scoreboardData', DASHBOARD_BUNDLE_NAME);
const currentBreakScene = nodecg.Replicant('activeBreakScene', DASHBOARD_BUNDLE_NAME);
const mainFlavorText = nodecg.Replicant('mainFlavorText', DASHBOARD_BUNDLE_NAME);
const casters = nodecg.Replicant('casters', DASHBOARD_BUNDLE_NAME);
const nowPlaying = nodecg.Replicant('nowPlaying', DASHBOARD_BUNDLE_NAME);
const NSTimerShown = nodecg.Replicant('NSTimerShown', DASHBOARD_BUNDLE_NAME);
const musicShown = nodecg.Replicant('musicShown', DASHBOARD_BUNDLE_NAME);
const nextTeams = nodecg.Replicant('nextTeams', DASHBOARD_BUNDLE_NAME);
const rounds = nodecg.Replicant('rounds', DASHBOARD_BUNDLE_NAME);
const activeRound = nodecg.Replicant('activeRoundId', DASHBOARD_BUNDLE_NAME);
const mapWinners = nodecg.Replicant('gameWinners', DASHBOARD_BUNDLE_NAME);
const teamScores = nodecg.Replicant('teamScores', DASHBOARD_BUNDLE_NAME);
const SBShown = nodecg.Replicant('SBShown', DASHBOARD_BUNDLE_NAME);
