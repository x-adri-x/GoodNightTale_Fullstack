import type { Jwt, JwtPayload } from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'
import { parseTokenPayload } from '@server/modules/user/tokenPayload'
import { publicProcedure } from '..'

type VerifyToken = (token: string) => Jwt | JwtPayload | string

export function buildAuthenticatedProcedure(verify: VerifyToken) {
  function getUserFromToken(token: string) {
    try {
      const tokenVerified = verify(token)
      const tokenParsed = parseTokenPayload(tokenVerified)

      return tokenParsed.user
    } catch (error) {
      return null
    }
  }

  return publicProcedure.use(({ ctx, next }) => {
    if (ctx.authUser) {
      // If we have an authenticated user, we can proceed.
      return next({
        ctx: {
          authUser: ctx.authUser,
        },
      })
    }

    if (!ctx.req) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Missing Express request object',
      })
    }

    const token = ctx.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthenticated. Please log in.',
      })
    }

    const authUser = getUserFromToken(token)

    if (!authUser) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token.',
      })
    }

    return next({
      ctx: {
        authUser,
      },
    })
  })
}
