
/**
 * Clear wallet state
 */
export async function clearWallet(): Promise<{ success: boolean; message: string }> {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'clear' },
  });
  return { success: true, message: 'Wallet cleared' };
}