import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthModule as AdminAuth } from './admin/auth/auth.module';
import { UserModule as AdminUser } from './admin/user/user.module';

const routes: Routes = [
    {
        path: 'v1',
        children: [
            { path: 'auth', module: AuthModule },
            { path: 'user', module: UserModule },
            // admin
            { path: 'admin/auth', module: AdminAuth },
            { path: 'admin/user', module: AdminUser },
        ],
    },
];

@Module({
    imports: [RouterModule.register(routes)],
    exports: [RouterModule],
})
export class V1Route { }
